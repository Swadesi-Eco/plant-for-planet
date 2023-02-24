import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import styles from './AccountHistory.module.scss';
import RecurrencyRecord from './components/RecurrencyRecord';
import { PauseModal } from './PauseModal';
import { CancelModal } from './CancelModal';
import { ReactivateModal } from './ReactivateModal';
import { useRouter } from 'next/router';
import { EditModal } from './EditModal';
import { Subscription } from '../../common/types/payments';

interface Props {
  isDataLoading: boolean;
  recurrencies?: Subscription[];
  fetchRecurrentDonations: (next?: boolean) => void;
}

export default function Recurrency({
  isDataLoading,
  recurrencies,
  fetchRecurrentDonations,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  const [selectedRecord, setSelectedRecord] = React.useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // const [openModal, setOpenModal] = React.useState(false);
  const [editModalOpen, seteditModalOpen] = React.useState(false);
  const [pauseModalOpen, setpauseModalOpen] = React.useState(false);
  const [cancelModalOpen, setcancelModalOpen] = React.useState(false);
  const [reactivateModalOpen, setreactivateModalOpen] = React.useState(false);
  const [currentRecord, setCurrentRecord] = React.useState<number>(0);
  const router = useRouter();

  // React.useEffect(() => {
  //   fetchRecurrentDonations();
  // }, [editModalOpen, pauseModalOpen, cancelModalOpen, reactivateModalOpen]);

  React.useEffect(() => {
    if (
      recurrencies &&
      selectedRecord !== null &&
      selectedRecord !== undefined
    ) {
      setCurrentRecord(recurrencies[selectedRecord]);
    }
  }, [selectedRecord, recurrencies]);

  const handleRecordToggle = (index: number | undefined) => {
    if (selectedRecord === index || index === undefined) {
      setSelectedRecord(null);
      setIsModalOpen(false);
    } else {
      setSelectedRecord(index);
      setIsModalOpen(true);
    }
  };

  /* const handleRecordOpen = (index: number) => {
    if (selectedRecord === index && window.innerWidth > 980) {
      setSelectedRecord(index);
      setOpenModal(false);
    } else {
      if (
        recurrencies &&
        (recurrencies[index]?.status !== 'incomplete' ||
          recurrencies[index]?.method === 'offline')
      ) {
        setSelectedRecord(index);
        setOpenModal(true);
      }
    }
  }; */

  /* const handleClose = () => {
    setOpenModal(false);
    setSelectedRecord(null);
  }; */
  const handlePauseModalClose = () => {
    setpauseModalOpen(false);
  };
  const handleCancelModalClose = () => {
    setcancelModalOpen(false);
  };
  const handleReactivateModalClose = () => {
    setreactivateModalOpen(false);
  };
  const handleEditModalClose = () => {
    seteditModalOpen(false);
  };

  return (
    <div className="profilePage">
      <>
        <div className={'profilePageTitle'}>{t('me:payments')}</div>
        <div className={'profilePageSubTitle'}>{t('me:donationsSubTitle')}</div>
        <div className={styles.pageContainer}>
          <div className={`${styles.section} ${styles.recurrencySection}`}>
            <div className={styles.recurrency}>
              <div className={styles.recurrencyList}>
                {!recurrencies && isDataLoading ? (
                  <>
                    <TransactionListLoader />
                    <TransactionListLoader />
                    <TransactionListLoader />
                  </>
                ) : recurrencies && recurrencies.length === 0 ? (
                  <div className={styles.notFound}>
                    <TransactionsNotFound />
                  </div>
                ) : (
                  recurrencies &&
                  !isDataLoading &&
                  Array.isArray(recurrencies) &&
                  recurrencies?.map((record: any, index: number) => {
                    return (
                      <RecurrencyRecord
                        key={index}
                        handleRecordToggle={handleRecordToggle}
                        index={index}
                        selectedRecord={selectedRecord}
                        record={record}
                        recurrencies={recurrencies}
                        seteditDonation={seteditModalOpen}
                        setpauseDonation={setpauseModalOpen}
                        setcancelDonation={setcancelModalOpen}
                        setreactivateDonation={setreactivateModalOpen}
                      />
                    );
                  })
                )}
              </div>
            </div>
            {isModalOpen && recurrencies?.length && selectedRecord !== null && (
              <RecurrencyRecord
                isModal={true}
                handleRecordToggle={handleRecordToggle}
                selectedRecord={selectedRecord}
                record={recurrencies[selectedRecord]}
                recurrencies={recurrencies}
                seteditDonation={seteditModalOpen}
                setpauseDonation={setpauseModalOpen}
                setcancelDonation={setcancelModalOpen}
                setreactivateDonation={setreactivateModalOpen}
              />
            )}
          </div>
          <PauseModal
            pauseModalOpen={pauseModalOpen}
            handlePauseModalClose={handlePauseModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <CancelModal
            cancelModalOpen={cancelModalOpen}
            handleCancelModalClose={handleCancelModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <EditModal
            editModalOpen={editModalOpen}
            handleEditModalClose={handleEditModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <ReactivateModal
            reactivateModalOpen={reactivateModalOpen}
            handleReactivateModalClose={handleReactivateModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
        </div>
      </>
    </div>
  );
}
