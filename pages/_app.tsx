import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import App, { AppProps, AppContext, AppInitialProps } from 'next/app';
import { Auth0Provider } from '@auth0/auth0-react';
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
import './../src/features/projects/styles/Projects.scss';
import './../src/features/common/Layout/Navbar/Navbar.scss';
import ThemeProvider from '../src/theme/themeContext';
import { useTranslation } from 'next-i18next';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import { browserNotCompatible } from '../src/utils/browsercheck';
import BrowserNotSupported from '../src/features/common/ErrorComponents/BrowserNotSupported';
import ProjectPropsProvider from '../src/features/common/Layout/ProjectPropsContext';
import { UserPropsProvider } from '../src/features/common/Layout/UserPropsContext';
import ErrorHandlingProvider from '../src/features/common/Layout/ErrorHandlingContext';
import dynamic from 'next/dynamic';
import { BulkCodeProvider } from '../src/features/common/Layout/BulkCodeContext';
import { AnalyticsProvider } from '../src/features/common/Layout/AnalyticsContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
import QueryParamsProvider from '../src/features/common/Layout/QueryParamsContext';
import { PlanetCashProvider } from '../src/features/common/Layout/PlanetCashContext';
import { PayoutsProvider } from '../src/features/common/Layout/PayoutsContext';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import { trpc } from '../src/utils/trpc';
import MapHolder from '../src/features/projects/components/maps/MapHolder';
import { TenantProvider } from '../src/features/common/Layout/TenantContext';
import {
  DEFAULT_TENANT,
  getTenantConfig,
  getTenantSlug,
} from '../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';

type AppOwnProps = { hostURL: string; tenantConfig: Tenant };

const VideoContainer = dynamic(
  () => import('../src/features/common/LandingVideo'),
  {
    ssr: false,
  }
);

const Layout = dynamic(() => import('../src/features/common/Layout'), {
  ssr: false,
});

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename?.replace(distDir, 'app:///_next');
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // from https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc,
    // also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
    ignoreErrors: [
      /^No error$/,
      /__show__deepen/,
      /_avast_submit/,
      /Access is denied/,
      /anonymous function: captureException/,
      /Blocked a frame with origin/,
      /console is not defined/,
      /cordova/,
      /DataCloneError/,
      /Error: AccessDeny/,
      /event is not defined/,
      /feedConf/,
      /ibFindAllVideos/,
      /myGloFrameList/,
      /SecurityError/,
      /MyIPhoneApp/,
      /snapchat.com/,
      /vid_mate_check is not defined/,
      /win\.document\.body/,
      /window\._sharedData\.entry_data/,
      /ztePageScrollModule/,
    ],
    denyUrls: [],
  });
}

const onRedirectCallback = (appState: any) => {
  // Use Next.js's Router.replace method to replace the url
  if (appState) Router.replace(appState?.returnTo || '/');
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const PlanetWeb = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps & AppOwnProps) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isMap, setIsMap] = React.useState(false);
  const [currencyCode, setCurrencyCode] = React.useState('');
  const [browserCompatible, setBrowserCompatible] = React.useState(false);

  const { tenantConfig } = pageProps;

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  if (process.env.NODE_ENV !== 'production') {
    if (process.env.VERCEL_URL && typeof window !== 'undefined') {
      if (process.env.VERCEL_URL !== window.location.hostname) {
        router.replace(`https://${process.env.VERCEL_URL}`);
      }
    }
  }

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    console.log('tenantConfig..', tenantConfig);
    storeConfig(tenantConfig);
  }, [tenantConfig]);

  React.useEffect(() => {
    if (i18n && i18n.isInitialized) {
      setInitialized(true);
    }
  }, [i18n, i18n.isInitialized]);

  React.useEffect(() => {
    if (
      localStorage.getItem('language') !== null &&
      i18n &&
      i18n.isInitialized
    ) {
      const languageFromLocalStorage: any = localStorage.getItem('language');
      i18n.changeLanguage(languageFromLocalStorage);
    }
  }, [i18n, i18n.isInitialized]);

  React.useEffect(() => {
    if (
      router.pathname === '/' ||
      router.pathname === '/[p]' ||
      router.pathname === '/[p]/[id]' ||
      router.pathname === '/_sites/[slug]' ||
      router.pathname === '/_sites/[slug]/[p]' ||
      router.pathname === '/_sites/[slug]/[p]/[id]'
    ) {
      setIsMap(true);
    } else {
      setIsMap(false);
    }
  }, [router]);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  React.useEffect(() => {
    setBrowserCompatible(browserNotCompatible());
  }, []);

  const ProjectProps = {
    pageProps,
    initialized,
    currencyCode,
    setCurrencyCode,
  };

  const [showVideo, setshowVideo] = React.useState(true);

  // if localShowVideo is undefined
  // set localShowVideo is true and show the video
  // if localShowVideo is true show the video
  // if localShowVideo is false hide the video

  const [localShowVideo, setLocalShowVideo] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname === '/') {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('showVideo')) {
          if (localStorage.getItem('showVideo') === 'true') {
            setLocalShowVideo(true);
          } else {
            setLocalShowVideo(false);
          }
        } else {
          localStorage.setItem('showVideo', 'true');
          setLocalShowVideo(true);
        }
      }
    } else {
      setLocalShowVideo(false);
    }
  }, []);

  React.useEffect(() => {
    setshowVideo(localShowVideo);
  }, [localShowVideo]);

  if (browserCompatible) {
    return <BrowserNotSupported />;
  } else {
    return tenantConfig ? (
      <CacheProvider value={emotionCache}>
        <ErrorHandlingProvider>
          <TenantProvider>
            <QueryParamsProvider>
              <div>
                <div
                  style={
                    showVideo &&
                    (tenantConfig.config.slug === 'planet' ||
                      tenantConfig.config.slug === 'ttc')
                      ? {}
                      : { display: 'none' }
                  }
                >
                  {tenantConfig.config.slug === 'planet' ||
                  tenantConfig.config.slug === 'ttc' ? (
                    <VideoContainer setshowVideo={setshowVideo} />
                  ) : (
                    <></>
                  )}
                </div>

                <div
                  style={
                    showVideo &&
                    (tenantConfig.config.slug === 'planet' ||
                      tenantConfig.config.slug === 'ttc')
                      ? { display: 'none' }
                      : {}
                  }
                >
                  <Auth0Provider
                    domain={process.env.AUTH0_CUSTOM_DOMAIN!}
                    clientId={
                      tenantConfig.config?.auth0ClientId
                        ? tenantConfig.config.auth0ClientId
                        : process.env.AUTH0_CLIENT_ID
                    }
                    redirectUri={
                      typeof window !== 'undefined'
                        ? window.location.origin
                        : ''
                    }
                    audience={'urn:plant-for-the-planet'}
                    cacheLocation={'localstorage'}
                    onRedirectCallback={onRedirectCallback}
                    useRefreshTokens={true}
                  >
                    <ThemeProvider>
                      <MuiThemeProvider theme={materialTheme}>
                        <CssBaseline />
                        <UserPropsProvider>
                          <PlanetCashProvider>
                            <PayoutsProvider>
                              <Layout>
                                <ProjectPropsProvider>
                                  <BulkCodeProvider>
                                    <AnalyticsProvider>
                                      {isMap ? (
                                        <MapHolder
                                          setshowVideo={setshowVideo}
                                        />
                                      ) : null}
                                      <Component {...ProjectProps} />
                                    </AnalyticsProvider>
                                  </BulkCodeProvider>
                                </ProjectPropsProvider>
                              </Layout>
                            </PayoutsProvider>
                          </PlanetCashProvider>
                        </UserPropsProvider>
                      </MuiThemeProvider>
                    </ThemeProvider>
                  </Auth0Provider>
                </div>
              </div>
            </QueryParamsProvider>
          </TenantProvider>
        </ErrorHandlingProvider>
      </CacheProvider>
    ) : (
      <></>
    );
  }
};

PlanetWeb.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  const _tenantSlug = await getTenantSlug(context.ctx.req?.headers.host);

  const tenantSlug = _tenantSlug ?? DEFAULT_TENANT;

  const tenantConfig = await getTenantConfig(tenantSlug);

  const pageProps = {
    ...ctx.pageProps,
    hostURL: `https://${context.ctx.req?.headers.host}`,
    tenantConfig,
  };

  return { ...ctx, pageProps } as AppOwnProps & AppInitialProps;
};

export default trpc.withTRPC(appWithTranslation(PlanetWeb, nextI18NextConfig));
