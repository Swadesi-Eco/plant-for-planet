import React, { ReactElement } from 'react';
import styles from './Stats.module.scss';
import i18next from '../../../../../i18n';
import OpenLink from '../../../../../public/assets/images/icons/OpenLink';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import { ThemeContext } from '../../../../theme/themeContext';

const { useTranslation } = i18next;

interface Props {
  infoExpanded: any;
  setInfoExpanded: Function;
  setModalOpen: Function;
}

function ExploreInfoModal({
  infoExpanded,
  setInfoExpanded,
  setModalOpen,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['planet']);
  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <div className={styles.infoExpanded}>
      {infoExpanded === 'donated' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('planet:treesDonated')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('planet:treesDonatedDescription')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'planted' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>
            {t('planet:plantedByTPO', { projects: 160 })}
          </div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('planet:treesPlantedDescription')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'global' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('planet:plantedGlobally')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('planet:globallySince')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'loss' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('planet:forestLoss')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            <p>{t('planet:estimateOf')} </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.nature.com/articles/nature14967"
              style={{ paddingTop: 20 }}
            >
              <OpenLink />
              <p>
                Crowther, T. W. et al. (2015) Mapping tree
                <br /> density at a global scale. Nature 525, 201–205.
              </p>
            </a>
          </div>
        </div>
      ) : null}
      <button
        id={'statsInfoModal'}
        onClick={() => {
          setInfoExpanded(null);
          setModalOpen(false);
        }}
        className={styles.infoClose}
      >
        <CancelIcon color="#d5d5d5" />
      </button>
    </div>
  ) : (
    <></>
  );
}

export default React.forwardRef((props: Props, ref) => (
  <ExploreInfoModal {...props} />
));
