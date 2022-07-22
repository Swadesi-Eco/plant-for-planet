import { ReactElement, useContext, useState, useCallback, useEffect } from 'react';
import { Autocomplete, styled, TextField } from '@mui/material';
import i18next from '../../../../../i18n';
import  { ProjectPropsContext } from '../../../../features/common/Layout/ProjectPropsContext'
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from './InlineFormDisplayGroup';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import React from 'react';
import { getRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
const { useTranslation } = i18next;

// TODOO - refactor code for reuse?
const StyledForm = styled('form')((/* { theme } */) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    width: '100%',
  },
}));

const DonationLinkForm = (): ReactElement | null => {
  const { user, contextLoaded } = useContext(UserPropsContext);
  const [country, setCountry] = useState(
    contextLoaded ? user.country : undefined
  );
  const [Languages, setLanguage ] = useState(
    {
      "langCode": "en",
      "languageName": "English"
    }
  );
  const { t, ready } = useTranslation(['donationLink']);
  const { handleError } = useContext(ErrorHandlingContext);
  const { projects, setProjects } = useContext(ProjectPropsContext);
  const [localProject, setLocalProject] = useState(null);
  
    // Load all projects
      async function fetchProjectList() {
        
          const projects = await getRequest(
            `/app/projects`,
            handleError,
            undefined,
            {
              _scope: 'default',
            }
          );
          setProjects(projects);
      }
    

    useEffect(() => {
      fetchProjectList();
    }, []);
  if (ready) {
    return (
      <StyledForm>
        <div>Donation Link Form</div>
        <div className="inputContainer">
          <InlineFormDisplayGroup>
            <AutoCompleteCountry
              label={t('labelCountry')}
              name="country"
              defaultValue={country}
              onChange={setCountry}
            />
            <Autocomplete
              id="Languages"
              options={supportedLanguages}
              getOptionLabel={(option) => `${option.langCode} - ${option.languageName}`}
              isOptionEqualToValue={(option, value) =>
                (option.langCode === value.langCode)
              }
              value={Languages}
              renderInput={(params) => (
                <TextField {...params} label="Language" placeholder="Languages" />
              )}
              sx={{ width: '50%' }}
              onChange={(event,newLan)=>setLanguage(newLan)}
            />
          </InlineFormDisplayGroup>
          <Autocomplete
            id="Projects"
            options={projects}
            getOptionLabel={(option) => option.name}
            defaultValue='Project Name'
            isOptionEqualToValue={(option, value) =>
              (option.id === value.id)
            }
            value={localProject}
            renderInput={(params) => (
              <TextField {...params} label="Project Name" placeholder="Project Name" />
            )}
            onChange={(event,newProject)=>setLocalProject(newProject)}
          />
        </div>
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
