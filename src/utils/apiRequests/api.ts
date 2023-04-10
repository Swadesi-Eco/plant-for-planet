import { ApiCustomError } from '../../features/common/types/apiErrors';
import { TENANT_ID } from '../constants/environment';
import { getQueryString } from './getQueryString';
import getsessionId from './getSessionId';
import { validateToken } from './validateToken';
import { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';
import { head } from 'cypress/types/lodash';

// Handle Error responses from API
const handleApiError = (
  error: number,
  result: any,
  errorHandler?: Function,
  redirect?: string
) => {
  if (error === 404) {
    //if error handler is passed, use it
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'notFound',
        redirect: redirect,
        code: error,
      });
    }
    // show error in console
    console.error('Error 404: Requested Resource Not Found!');
  } else if (error === 401) {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 401: You are not Authorized!');
  } else if (error === 403) {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 403: Forbidden');
  } else if (error === 400) {
    if (!result || !result['error_code']) {
      if (errorHandler) {
        errorHandler({
          type: 'error',
          message: 'validationFailed',
          redirect: redirect,
        });
      }
      console.error('Error 400: Validation Failed!');
    }
  } else if (error === 500) {
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'internalServerError',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 500: Server Error!');
  }
};

//  API call to private /profile endpoint
export async function getAccountInfo(
  token: any,
  impersonatedData?:ImpersonationData 
): Promise<any> {
    const data = localStorage.getItem("impersonationData") ;
    const impersonatedDataFromLocal = JSON.parse(data);
    const header : any = {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `Bearer ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    
    }
    if(impersonatedData?.targetEmail || impersonatedDataFromLocal?.targetEmail ){
      header["X-SWITCH-USER"] = impersonatedData?.targetEmail || impersonatedDataFromLocal?.targetEmail 
    }

    if(impersonatedData?.supportPin || impersonatedDataFromLocal?.supportPin){
      header["X-USER-SUPPORT-PIN"] = impersonatedData?.supportPin || impersonatedDataFromLocal?.supportPin 
    }
    const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
    method: 'GET',
    headers: header
  });
  return response;
}

function isAbsoluteUrl(url: any) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

export async function getRequest<T>(
  url: any,
  errorHandler?: Function,
  redirect?: string,
  queryParams?: { [key: string]: string },
  version?: string
) {
  let result;
  const lang = localStorage.getItem('language') || 'en';
  const query: any = { ...queryParams, locale: lang };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';
  const fullUrl = isAbsoluteUrl(url)
    ? url
    : `${process.env.API_ENDPOINT}${url}${queryStringSuffix}`;

  await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
      'x-accept-versions': version ? version : '1.0.3',
    },
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, result, errorHandler, redirect);
    })
    .catch((err) => console.error(`Unhandled Exception: ${err}`));
  return result as unknown as T;
}

export async function getAuthenticatedRequest<T>(
  url: any,
  token: any,
  header: any = null,
  errorHandler?: Function,
  redirect?: string,
  queryParams?: { [key: string]: string },
  version?: string
): Promise<T> {
  let result = {};
  const lang = localStorage.getItem('language') || 'en';
  const targetData = localStorage.getItem("impersonationData") ;
  const impersonatedDataFromLocal = JSON.parse(targetData);
  const query: any = { ...queryParams };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';
  const headers = {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `Bearer ${token}`,
      'x-locale': `${lang}`,
      'x-accept-versions': version ? version : '1.0.3',
      ...(header ? header : {}),
  }
  if(impersonatedDataFromLocal?.targetEmail ){
    headers["X-SWITCH-USER"] =  impersonatedDataFromLocal?.targetEmail 
  }

  if( impersonatedDataFromLocal?.supportPin){
    headers["X-USER-SUPPORT-PIN"] =  impersonatedDataFromLocal?.supportPin 
  }
  await fetch(`${process.env.API_ENDPOINT}${url}${queryStringSuffix}`, {
    method: 'GET',
    headers: headers
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, result, errorHandler, redirect);
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result as unknown as T;
}

export async function postRequest(
  url: any,
  data: any,
  errorHandler?: Function,
  redirect?: string
): Promise<any> {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  const result = await res.json();
  handleApiError(res.status, result, errorHandler, redirect);
  return result;
}

export async function postAuthenticatedRequest<T>(
  url: any,
  data: any,
  token: any,
  errorHandler?: Function,
  headers?: any
): Promise<T | ApiCustomError | null> {
  const targetData = localStorage.getItem("impersonationData") ;
  const  impersonatedDataFromLocal = JSON.parse(targetData);
  const header = {
    'Content-Type': 'application/json',
    'tenant-key': `${TENANT_ID}`,
    'X-SESSION-ID': await getsessionId(),
    Authorization: `Bearer ${token}`,
    'x-locale': `${
      localStorage.getItem('language')
        ? localStorage.getItem('language')
        : 'en'
    }`,
    ...(headers ? headers : {}),
  }
  if(impersonatedDataFromLocal?.targetEmail ){
    header["X-SWITCH-USER"] =  impersonatedDataFromLocal?.targetEmail 
  }

  if( impersonatedDataFromLocal?.supportPin){
    header["X-USER-SUPPORT-PIN"] =  impersonatedDataFromLocal?.supportPin 
  }
  if (validateToken(token)) {
    try {
      const res = await fetch(process.env.API_ENDPOINT + url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: header
      });
      const result = await res.json();
      handleApiError(res.status, result, errorHandler);
      return result as unknown as T | ApiCustomError;
    } catch (err) {
      // Fetch API only throws errors for network errors
      console.log(
        'Could not reach the server. Please check your internet connection.'
      );
      if (errorHandler) {
        errorHandler({
          type: 'error',
          message: 'connectionError',
        });
      }
      return null;
    }
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
    return null;
  }
}

export async function deleteAuthenticatedRequest(
  url: any,
  token: any,
  errorHandler?: Function
): Promise<any> {
  const targetData = localStorage.getItem("impersonationData") ;
  const  impersonatedDataFromLocal = JSON.parse(targetData);
  const header : any = {
    'Content-Type': 'application/json',
    'tenant-key': `${TENANT_ID}`,
    'X-SESSION-ID': await getsessionId(),
    Authorization: `Bearer ${token}`,
    'x-locale': `${
      localStorage.getItem('language')
        ? localStorage.getItem('language')
        : 'en'
    }`,
  }
  if(impersonatedDataFromLocal?.targetEmail ){
    header["X-SWITCH-USER"] =  impersonatedDataFromLocal?.targetEmail 
  }

  if( impersonatedDataFromLocal?.supportPin){
    header["X-USER-SUPPORT-PIN"] =  impersonatedDataFromLocal?.supportPin 
  }
  let result;
  if (validateToken(token)) {
    await fetch(process.env.API_ENDPOINT + url, {
      method: 'DELETE',
      headers: header
    }).then(async (res) => {
      result = res.status === 400 ? await res.json() : res.status;
      handleApiError(res.status, result, errorHandler);
    });
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
  }
  return result;
}

export async function putRequest(
  url: any,
  data: any,
  errorHandler?: Function
): Promise<any> {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  const result = await res.json();
  handleApiError(res.status, result, errorHandler);
  return result;
}

export async function putAuthenticatedRequest<T>(
  url: any,
  data: any,
  token: any,
  errorHandler?: Function
): Promise<T | ApiCustomError | undefined> {
  const targetData = localStorage.getItem("impersonationData") ;
  const impersonatedDataFromLocal = JSON.parse(targetData);
  const header : any = {
    'Content-Type': 'application/json',
    'tenant-key': `${TENANT_ID}`,
    'X-SESSION-ID': await getsessionId(),
    Authorization: `Bearer ${token}`,
    'x-locale': `${
      localStorage.getItem('language')
        ? localStorage.getItem('language')
        : 'en'
    }`,
  }
  if(impersonatedDataFromLocal?.targetEmail ){
    header["X-SWITCH-USER"] =  impersonatedDataFromLocal?.targetEmail 
  }

  if( impersonatedDataFromLocal?.supportPin){
    header["X-USER-SUPPORT-PIN"] =  impersonatedDataFromLocal?.supportPin 
  }
  if (validateToken(token)) {
    const res = await fetch(process.env.API_ENDPOINT + url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers:header
    });
    const result = await res.json();
    handleApiError(res.status, result, errorHandler);
    return result as unknown as T | ApiCustomError;
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
  }
}

export async function getRasterData(
  id: any,
  errorHandler?: Function
): Promise<any> {
  let result;
  await fetch(`${process.env.SITE_IMAGERY_API_URL}/api/v1/project/${id}`)
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, result, errorHandler);
      return result;
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}
