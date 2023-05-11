import React, { ReactElement } from 'react';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../StepForm.module.scss';
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import { useTranslation } from 'next-i18next';
import NotReviewed from '../../../../../public/assets/images/icons/manageProjects/NotReviewed';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import router from 'next/router';
import { Button } from '@mui/material';
import { ProjectCreationTabs } from '..';
import { SubmitForReviewProps } from '../../../common/types/project';

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectGUID,
  handleReset,
  projectDetails,
  handlePublishChange,
}: SubmitForReviewProps): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });
  function UnderReviewComponent() {
    const [publish, setPublish] = React.useState<boolean>(
      projectDetails.publish
    );

    return (
      <>
        <div className={`${styles.formFieldRadio} ${styles.publishLabel} `}>
          <label
            htmlFor={'publish'}
            style={{ cursor: 'pointer' }}
            data-test-id="publishProject"
          >
            {t('manageProjects:publishProject')}
          </label>

          <ToggleSwitch
            checked={publish}
            onChange={(e) => handlePublishChange(e.target.checked)}
            id="publish"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
        <div className={styles.reviewImageContainer}>
          <UnderReview />
        </div>
        <p className={styles.reviewMessage}>
          {t('manageProjects:projectUnderReview')}
        </p>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            className={styles.backButton}
          >
            <BackArrow />
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push('/profile/projects')}
            className={styles.saveAndContinueButton}
          >
            <p>{t('manageProjects:exit')}</p>
          </Button>
        </div>
      </>
    );
  }

  function NotSubmittedReview() {
    const [publish, setPublish] = React.useState<boolean>(
      projectDetails.publish
    );

    return (
      <>
        <div className={styles.formFieldRadio} style={{ marginBottom: '10px' }}>
          <div>
            <label
              htmlFor={'publish'}
              style={{ cursor: 'pointer' }}
              data-test-id="publishProject"
            >
              {t('manageProjects:publishProject')}
            </label>
          </div>

          <div>
            <ToggleSwitch
              checked={publish}
              onChange={(e) => handlePublishChange(e.target.checked)}
              id="publish"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>

        <div>
          <div className={styles.reviewImageContainer}>
            <NotReviewed />
          </div>
          <p className={styles.reviewMessage}>
            {t('manageProjects:projectForReview')}
          </p>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            className={styles.backButton}
            variant="outlined"
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
          >
            <BackArrow />
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>

          <Button
            className={styles.saveAndContinueButton}
            onClick={() => submitForReview()}
            variant="contained"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:submitForReview')
            )}
          </Button>

          <Button
            className={styles.skipButton}
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
          </Button>
        </div>
      </>
    );
  }

  function AcceptedReview() {
    return (
      <>
        <div className={styles.formFieldLarge}>
          <div className={styles.reviewImageContainer}>
            <SubmitForReviewImage />
          </div>
          <p className={styles.reviewMessage}>
            {t('manageProjects:acceptedReview')}
          </p>
          <div className={styles.buttonsForProjectCreationForm}>
            <Button
              onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
              variant="outlined"
              className={styles.backButton}
            >
              <BackArrow />
              <p>{t('manageProjects:backToSpending')}</p>
            </Button>
            <Button
              className={styles.skipButton}
              variant="contained"
              onClick={() => router.push('/profile/projects')}
            >
              <p>{t('manageProjects:exit')}</p>
            </Button>
          </div>
        </div>
      </>
    );
  }

  function DeniedReview() {
    return (
      <>
        <div className={styles.formFieldLarge}>
          <div className={styles.reviewImageContainer}>
            <UnderReview />
          </div>
          <p className={styles.reviewMessage}>
            {t('manageProjects:deniedReview')}
          </p>
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
          >
            <BackArrow />
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>
          <Button
            className={styles.skipButton}
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
          </Button>
        </div>
      </>
    );
  }

  switch (projectDetails.verificationStatus) {
    case 'incomplete':
      return ready ? <NotSubmittedReview /> : <></>;
    case 'pending':
      return ready ? <UnderReviewComponent /> : <></>;
    case 'processing':
      return ready ? <UnderReviewComponent /> : <></>;
    case 'accepted':
      return ready ? <AcceptedReview /> : <></>;
    case 'denied':
      return ready ? <DeniedReview /> : <></>;
    default:
      return ready ? <UnderReviewComponent /> : <></>;
  }
}

export default SubmitForReview;
