import React from 'react';
import styles from './DeleteProfile.module.scss';
import { deleteAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CustomModal from '../../../common/Layout/CustomModal';
import router from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button, TextField } from '@mui/material';
import StyledForm from '../../../common/Layout/StyledForm';
import { APIError, handleError, SerializedError } from '@planet-sdk/common';

export default function DeleteProfileForm() {
  const { user, token, logoutUser } = useUserProps();
  const { t } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e: React.ChangeEvent<{}>) => {
    e.preventDefault();
  };
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [isModalOpen, setisModalOpen] = React.useState(false); //true when subscriptions are present
  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = async () => {
    setIsUploadingData(true);
    try {
      await deleteAuthenticatedRequest('/app/profile', token, logoutUser);
      setIsUploadingData(false);
      logoutUser(`${process.env.NEXTAUTH_URL}/`);
    } catch (err) {
      setIsUploadingData(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors: SerializedError[] = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'active_subscriptions':
            setisModalOpen(true);
            break;

          default:
            _serializedErrors.push(error);
            break;
        }
      }

      setErrors(_serializedErrors);
    }
  };
  const handleSubscriptions = () => {
    setisModalOpen(false);
    router.push('/profile/recurrency');
  };

  const closeModal = () => {
    setisModalOpen(false);
    setcanDeleteAccount(false);
  };

  return !isModalOpen ? (
    <StyledForm>
      <div className="inputContainer">
        <div>
          <p>
            {t('common:deleteAccountMessage', {
              delete: 'Delete',
            })}
            <br />
            <br />
            {t('common:alternativelyEditProfile')}
          </p>
          <TextField
            // placeholder={t('common:deleteAccount')}
            label={t('common:deleteAccountLabel', { delete: 'Delete' })}
            type="text"
            variant="outlined"
            style={{ marginTop: '20px' }}
            name="addTarget"
            onCut={handleChange}
            onCopy={handleChange}
            onPaste={handleChange}
            onChange={(e) => {
              if (e.target.value === 'Delete') {
                setcanDeleteAccount(true);
              } else {
                setcanDeleteAccount(false);
              }
            }}
          ></TextField>
          <p className={styles.deleteConsent}>
            {t('common:deleteAccountConsent')}
          </p>
          <br />
          <br />
          <b>{t('common:deleteCondition')}</b>
          <p className={styles.deleteModalWarning}>
            {t('common:deleteIrreversible', {
              email: user?.email,
            })}
          </p>

          <div style={{ marginTop: 20 }}>
            {canDeleteAccount ? (
              <Button
                variant="contained"
                onClick={() => handleDeleteAccount()}
                sx={{
                  backgroundColor: `${styles.dangerColor}`,
                  '&:hover': { backgroundColor: `${styles.dangerColor}` },
                }}
              >
                {isUploadingData ? (
                  <div className={'spinner'}></div>
                ) : (
                  t('common:delete')
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#f2f2f7',
                  color: '#2f3336',
                  '&:hover': { backgroundColor: '#f2f2f7' },
                }}
              >
                {t('common:delete')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </StyledForm>
  ) : (
    <CustomModal
      isOpen={isModalOpen}
      handleContinue={handleSubscriptions}
      handleCancel={closeModal}
      buttonTitle={t('common:showSubscriptions')}
      modalTitle={t('common:modalTitle')}
      modalSubtitle={t('common:modalSubtitle')}
    />
  );
}
