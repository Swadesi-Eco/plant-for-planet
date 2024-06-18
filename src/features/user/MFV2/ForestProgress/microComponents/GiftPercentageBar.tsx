import styles from '../ForestProgress.module.scss';
import { BarsProps } from './Bars';

const GiftPercentageBar = ({
  personalPercentage,
  giftPercentage,
  target,
  gift,
  personal,
}: BarsProps) => {
  const totalAchievment = gift + personal;
  return (
    <div
      style={{
        width: `${giftPercentage}%`,
        borderTopRightRadius: `${
          target > gift && totalAchievment < target ? 0 : 5
        }px`,
        borderBottomRightRadius: `${
          target > gift && totalAchievment < target ? 0 : 5
        }px`,
        borderTopLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
        borderBottomLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
      }}
      className={`${styles.giftPercentageBar} giftPercentageBar`}
    ></div>
  );
};

export default GiftPercentageBar;
