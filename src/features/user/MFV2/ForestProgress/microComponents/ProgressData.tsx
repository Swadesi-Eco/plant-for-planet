import {
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { DataType } from '../ForestProgressItem';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styles from '../ForestProgress.module.scss';
import StackedBarGraph from './StackedBarGraph';

export interface ProgressDataProps {
  giftPercentage: number;
  personalPercentage: number;
  gift: number;
  personal: number;
  dataType: DataType;
  target: number;
}

const ForestProgressIcon = ({ dataType }: { dataType: DataType }) => {
  switch (dataType) {
    case 'treesPlanted':
      return <TreesPlantedIcon width={19} />;
    case 'areaRestored':
      return <AreaRestoredIcon width={17} />;
    case 'areaConserved':
      return <ConservedAreaIcon width={13} />;
  }
};

const GiftReceivedFromCommunity = ({
  gift,
  label,
}: {
  gift: number;
  label: string;
}) => {
  return (
    <>
      {' '}
      {gift !== undefined && gift > 0 && (
        <div className={styles.communityReceived}>{label}</div>
      )}
    </>
  );
};

const ProgressData = ({
  giftPercentage,
  personalPercentage,
  gift,
  personal,
  dataType,
  target,
}: ProgressDataProps) => {
  const tProfile = useTranslations('Profile.progressBar');
  const totalAchievment = gift + personal;
  const getLabel = useMemo(() => {
    const isTargetSet = target > 0;
    const targetAchievedUnit =
      totalAchievment !== Math.floor(totalAchievment)
        ? totalAchievment.toFixed(1)
        : totalAchievment;
    const hasDecimalPart = target !== Math.floor(target);
    const _target = hasDecimalPart ? target.toFixed(1) : target;
    switch (dataType) {
      case 'treesPlanted':
        return isTargetSet
          ? tProfile('treePlantedAgainstTarget', {
              count: targetAchievedUnit,
              total: _target,
            })
          : tProfile('treePlanted', {
              count: targetAchievedUnit,
            });

      case 'areaRestored':
        return isTargetSet
          ? tProfile('restoredAreaAgainstTarget', {
              count: targetAchievedUnit,
              unit: _target,
            })
          : tProfile('restoredArea', {
              unit: targetAchievedUnit,
            });

      case 'areaConserved':
        return isTargetSet
          ? tProfile('conservedAreaAgainstTarget', {
              count: targetAchievedUnit,
              unit: _target,
            })
          : tProfile('conservedArea', {
              unit: targetAchievedUnit,
            });

      default:
        return '';
    }
  }, [dataType, target]);

  const graphProps = {
    personalPercentage,
    giftPercentage,
    gift,
    personal,
    target,
  };
  const label = tProfile('totalGiftFromCommunity', {
    quantity: gift,
  });

  const giftReceivedProps = {
    label,
    gift,
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.statisticsMainContainer}>
        <div className={`${styles.iconContainer} iconContainer`}>
          <ForestProgressIcon dataType={dataType} />
        </div>
        <div className={styles.statisticsContainer}>
          <div className={styles.stat}>{getLabel}</div>
          <StackedBarGraph {...graphProps} />
          <GiftReceivedFromCommunity {...giftReceivedProps} />
        </div>
      </div>
    </div>
  );
};

export default ProgressData;
