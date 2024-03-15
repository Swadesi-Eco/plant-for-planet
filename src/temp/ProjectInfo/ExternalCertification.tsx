import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { useTranslation } from 'next-i18next';
import DownloadIcon from '../icons/DownloadIcon';
import SingleProjectInfoItem from './SingleProjectInfoItem';

interface Props {
  certification: string;
  spendings: ProjectExpense[];
  progressReports: number[];
}

const ExternalCertification = ({
  certification,
  spendings,
  progressReports,
}: Props) => {
  const { t, i18n } = useTranslation(['manageProjects', 'projectDetails']);
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;

  const renderDownloadIcon = () => {
    return (
      <div className={styles.downloadIcon}>
        <DownloadIcon
          width={10}
          color={`${'rgba(var(--certification-background-color-new))'}`}
        />
      </div>
    );
  };

  const certificationContent = [
    {
      title: `${t('manageProjects:externalCertifications')}`,
      content: (
        <div className={styles.infoDetail}>
          {isMobile ? (
            <div className={styles.certificationLabel}>{certification}</div>
          ) : (
            <div className={styles.certificationLabel}>
              <a href="#" target="_blank" rel="noreferrer">
                {certification}
              </a>
            </div>
          )}
          {renderDownloadIcon()}
        </div>
      ),
    },
    {
      title: `${t('manageProjects:projectSpending')}`,
      content: (
        <div className={styles.spendingsContainer}>
          {spendings.map((expense) => (
            <div className={styles.spendingDetail} key={expense.id}>
              {isMobile ? (
                <time className={styles.certificationLabel}>
                  {expense.year}
                </time>
              ) : (
                <div className={styles.certificationLabel}>
                  <a href="#" target="_blank" rel="noreferrer">
                    {expense.year}
                  </a>
                </div>
              )}

              <div>
                {getFormatedCurrency(i18n.language, 'EUR', expense.amount)}
              </div>

              {renderDownloadIcon()}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: `${t('projectDetails:progressReports')}`,
      content: (
        <div className={styles.reportsContainer}>
          {progressReports.map((report) => (
            <div key={report}>
              {isMobile ? (
                <div className={styles.certificationLabel}>{report}</div>
              ) : (
                <div className={styles.certificationLabel}>
                  <a href="#" target="_blank" rel="noreferrer">
                    {report}
                  </a>
                </div>
              )}
              {renderDownloadIcon()}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.certificationContainer}>
      {certificationContent.map((item) => (
        <SingleProjectInfoItem
          key={item.title}
          title={item.title}
          itemContent={item.content}
        />
      ))}
    </div>
  );
};

export default ExternalCertification;
