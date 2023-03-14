import React, { ReactElement } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { useTranslation } from 'next-i18next';
import TransferDetails from './TransferDetails';
import themeProperties from '../../../../theme/themeProperties';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { Subscription } from '../../../common/types/payments';

interface CommonProps {
  handleRecordToggle: (index: number | undefined) => void;
  selectedRecord: number | null;
  record: Subscription;
  recurrencies: Subscription[];
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setpauseDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setcancelDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setreactivateDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalProps extends CommonProps {
  index?: undefined;
  isModal: true;
}

interface ListItemProps extends CommonProps {
  index: number;
  isModal?: false;
}

type Props = ModalProps | ListItemProps;

export default function RecurrencyRecord({
  isModal = false,
  index = undefined,
  handleRecordToggle,
  selectedRecord,
  record,
  seteditDonation,
  setpauseDonation,
  setcancelDonation,
  setreactivateDonation,
}: Props): ReactElement {
  const outerDivClasses = isModal
    ? styles.recordModal
    : `${styles.record} ${selectedRecord === index ? styles.selected : ''}`;

  return (
    <div className={outerDivClasses}>
      {isModal && (
        <div
          onClick={() => {
            handleRecordToggle(index);
          }}
          className={styles.closeRecord}
        >
          <BackButton />
        </div>
      )}
      {(!isModal || (isModal && selectedRecord !== null)) && (
        <>
          <RecordHeader
            record={record}
            handleRecordToggle={handleRecordToggle}
            index={index}
          />
          {(isModal || index === selectedRecord) && (
            <div className={styles.divider} />
          )}
          <div className={styles.detailContainer}>
            <div className={styles.detailGrid}>
              <DetailsComponent record={record} />
            </div>
            {record.method === 'offline' && record.bankAccount && (
              <TransferDetails account={record.bankAccount} />
            )}
            {record.status !== 'incomplete' && (
              <ManageDonation
                record={record}
                seteditDonation={seteditDonation}
                setpauseDonation={setpauseDonation}
                setcancelDonation={setcancelDonation}
                setreactivateDonation={setreactivateDonation}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface HeaderProps {
  record: Subscription;
  handleRecordToggle?: (index: number | undefined) => void;
  index?: number;
}

export function RecordHeader({
  record,
  handleRecordToggle,
  index,
}: HeaderProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <div
      onClick={handleRecordToggle && (() => handleRecordToggle(index))}
      className={`${styles.recurrencyRecordHeader}`}
      style={{
        cursor: record?.status === 'incomplete' ? 'default' : 'pointer',
      }}
    >
      <div className={styles.left}>
        {record.destination.type === 'planet-cash' ? (
          <p className={styles.top}>{t('planetCashPayment')}</p>
        ) : (
          <p className={styles.top}>{record?.destination?.name}</p>
        )}

        {record?.endsAt ? (
          <p>
            {new Date(record?.endsAt) < new Date()
              ? t('cancelledOn')
              : t('willBeCancelledOn')}{' '}
            {formatDate(
              new Date(
                new Date(record?.endsAt).valueOf() + 1000 * 3600
              ).toISOString()
            )}{' '}
            • {t(record?.frequency)}
          </p>
        ) : record?.status === 'paused' ? (
          record?.pauseUntil ? (
            <p>
              {t('pausedUntil')}{' '}
              {formatDate(
                new Date(
                  new Date(record?.pauseUntil).valueOf() + 1000 * 3600
                ).toISOString()
              )}{' '}
              • {t(record?.frequency)}
            </p>
          ) : (
            <p>{t('pausedUntilResumed')}</p>
          )
        ) : (
          <span>
            {t('nextOn')}{' '}
            {formatDate(
              new Date(
                new Date(record?.currentPeriodEnd).valueOf()
              ).toISOString()
            )}{' '}
            •{' '}
            <span style={{ textTransform: 'capitalize' }}>
              {t(record?.frequency)}
            </span>
          </span>
        )}
      </div>
      <div className={styles.right}>
        <p
          className={styles.top}
          style={{ color: themeProperties.primaryColor }}
        >
          {getFormatedCurrency(i18n.language, record.currency, record.amount)}
        </p>
        <p
          className={`${styles.status} ${
            record?.status === 'paused'
              ? styles.paused
              : record?.status === 'canceled' ||
                record?.status === 'incomplete_expired'
              ? styles.cancelled
              : styles.active
          }`}
        >
          {record?.status === 'trialing' ? 'active' : t(record?.status)}
        </p>
      </div>
    </div>
  );
}

interface DetailProps {
  record: Subscription;
}

export function DetailsComponent({ record }: DetailProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <>
      {record.amount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('amount')}</p>
          <p>
            {getFormatedCurrency(i18n.language, record.currency, record.amount)}
          </p>
        </div>
      )}
      {record.frequency && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('frequency')}</p>
          <p>{t(record?.frequency)}</p>
        </div>
      )}
      {record?.method && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('paymentMethod')}</p>
          <p>{t(record.method)}</p>
        </div>
      )}
      {!Number.isNaN(record.totalDonated) && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('totalDonated')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.totalDonated
            )}
          </p>
        </div>
      )}
      {record?.donorName && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('donorName')}</p>
          <p>{record?.donorName}</p>
        </div>
      )}
      {record.firstDonation?.created && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('firstDonation')}</p>
          <p>{formatDate(record.firstDonation.created)}</p>
        </div>
      )}
      {record?.destination?.type === 'planet-cash' ? (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('planet-cash')}</p>
          <p>{t('planetCashPayment')}</p>
        </div>
      ) : (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('project')}</p>
          {record.destination.id ? (
            <a href={`/${record.destination.id}`}>{record.destination?.name}</a>
          ) : (
            <p>{record.destination?.name}</p>
          )}
        </div>
      )}

      {record.firstDonation?.reference && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('reference')}</p>
          <p>{record.firstDonation.reference}</p>
        </div>
      )}
    </>
  );
}

interface ManageDonationProps {
  record: Subscription;
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setpauseDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setcancelDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setreactivateDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ManageDonation({
  record,
  seteditDonation,
  setpauseDonation,
  setcancelDonation,
  setreactivateDonation,
}: ManageDonationProps): ReactElement {
  const { t } = useTranslation(['me']);

  const showPause =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt &&
    record.paymentGateway !== 'offline';
  const showEdit =
    (record?.status === 'active' || record?.status === 'trialing') &&
    record?.endsAt === null;
  const showCancel =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt;
  const showReactivate =
    record?.status === 'paused' || new Date(record?.endsAt) > new Date();
  return (
    <div className={styles.manageDonations}>
      {showEdit ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.primaryColor }}
          onClick={() => seteditDonation(true)}
        >
          {t('editDonation')}
        </button>
      ) : (
        []
      )}
      {showReactivate ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.light.safeColor }}
          onClick={() => setreactivateDonation(true)}
        >
          {record?.status === 'paused'
            ? t('resumeDonation')
            : t('reactivateDonation')}
        </button>
      ) : (
        []
      )}
      {showPause ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.light.secondaryColor }}
          onClick={() => setpauseDonation(true)}
        >
          {t('pauseDonation')}
        </button>
      ) : (
        []
      )}
      {showCancel ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.light.dangerColor }}
          onClick={() => setcancelDonation(true)}
        >
          {t('cancelDonation')}
        </button>
      ) : (
        []
      )}
    </div>
  );
}
