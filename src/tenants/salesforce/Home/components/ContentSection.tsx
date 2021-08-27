import gridStyles from './../styles/Grid.module.scss'
import styles from './../styles/ContentSection.module.scss';

export default function ContentSection() {
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h2>This beautiful planet is the only home we have.</h2>
            <p className={styles.contentSectionSubhead}>From the Andes to the Outback, the mangroves of Madagascar, and the rugged Montana forests at the rooftops of the world, life on Earth hangs in the balance. We need trees to breathe, clean our water, cool our planet, retain carbon, and prevent soil erosion. They also add grace and beauty to our communities and create homes for 80% of all terrestrial life. Half the world’s forests are gone and without forests, life as we know it ceases to exist. It’s time for us to act.
            </p>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
            <img src="/tenants/salesforce/images/illustration-1.png" className={gridStyles.illustration1} alt="" />
          </div>
          <div className={`${gridStyles.colMd7} ${gridStyles.col12} ${styles.justifyContentCenter}`}>
            <h3>Together, we are powerful.</h3>
            <p>In January 2020, as a founding partner of 1t.org, Salesforce announced our goal to conserve, restore, and grow 100 million trees by the end of 2030. We have a responsibility to use our full power to limit global warming to 1.5° Celsius or less. We’re simply asking you to participate and rally your allies to create a world that is just and equitable, so everyone can have equal access to clean air, water, and energy.</p>
          </div>
        </div>
        <div className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}>
          <div className={`${gridStyles.colMd7} ${gridStyles.col12} ${gridStyles.orderSm1} ${gridStyles.orderMd0} ${styles.justifyContentCenter}`}>
            <h3>How can you help?</h3>
            <p>Please visit Plant for the Planet and see what trees you’d like to plant. Then look for your donation on the Donation Tracker below, and spread the word to your family, friends, colleagues, and network. There’s far to go, but we can do it together.</p>
          </div>
          <div className={`${gridStyles.colMd3} ${gridStyles.col12} ${gridStyles.orderSm0} ${gridStyles.orderMd1}`}>
            <img src="/tenants/salesforce/images/illustration-2.png" className={gridStyles.illustration2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
