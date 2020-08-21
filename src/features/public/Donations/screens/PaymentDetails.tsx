import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import CreditCard from '../../../../assets/images/icons/donation/CreditCard';
import InfoIcon from '../../../../assets/images/icons/donation/InfoIcon';
import PaypalIcon from '../../../../assets/images/icons/donation/PaypalIcon';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild';
import styles from './../styles/PaymentDetails.module.scss';
interface Props {
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
}

function PaymentDetails({
  treeCount,
  treeCost,
  currency,
  setDonationStep,
}: Props): ReactElement {
  const [saveCardDetails, setSaveCardDetails] = React.useState(false);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          onClick={() => setDonationStep(2)}
          className={styles.headerBackIcon}
        >
          <BackArrow />
        </div>
        <div className={styles.headerTitle}>Payment Details</div>
      </div>
      <div className={styles.paymentError}>
        Error, Payment failed. Please try again.
      </div>

      <div className={styles.paymentModeContainer}>
        <div className={styles.paymentModeHeader}>
          <CreditCard />
          <div className={styles.paymentModeTitle}>Credit Card</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div>
        </div>

        <div className={styles.formRow}>
          <MaterialTextFeild label="Credit Card Number" variant="outlined" />
        </div>
        <div className={styles.formRow}>
          <MaterialTextFeild label="Exp. Date" variant="outlined" />
          <div style={{ width: '20px' }}></div>
          <MaterialTextFeild label="CVV" variant="outlined" />
        </div>
        <div className={styles.saveCard}>
          <div className={styles.saveCardText}>
            Save card for future Donations
          </div>
          <Switch
            checked={saveCardDetails}
            onChange={() => setSaveCardDetails(!saveCardDetails)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      </div>

      <div className={styles.paymentModeContainer}>
        <div className={styles.paymentModeHeader}>
          {/* <PaypalButton /> */}
          <PaypalIcon />
          <div className={styles.paymentModeTitle}>Paypal</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div>
        </div>
      </div>

      {/* <div className={styles.paymentModeContainer}>
        <div className={styles.paymentModeHeader}>
          <SepaIcon />
          <div className={styles.paymentModeTitle}>SEPA Direct Debit</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,35 fee</div>
            <InfoIcon />
          </div>
        </div>
      </div> */}

      <div className={styles.horizontalLine} />

      <div className={styles.finalTreeCount}>
        <div className={styles.totalCost}>
          {currency} {(treeCount * treeCost).toFixed(2)}{' '}
        </div>
        <div className={styles.totalCostText}>for {treeCount} Trees</div>
      </div>

      <div className={styles.actionButtonsContainer}>
        <div className={styles.continueButton}>Continue</div>
      </div>
    </div>
  );
}

export default PaymentDetails;
