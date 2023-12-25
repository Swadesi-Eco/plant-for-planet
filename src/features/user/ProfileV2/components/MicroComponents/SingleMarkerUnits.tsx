import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useTranslation } from 'next-i18next';

export interface SingleMarkerUnitsProps {
  isNormalTreeDonation: boolean;
  isRegisteredTree: boolean;
  isRestorationTreePlantation: boolean;
  isConservation: boolean;
  isGiftContribution: boolean;
  units: number;
}

const SingleMarkerUnits = ({
  isConservation,
  isRestorationTreePlantation,
  units,
  isRegisteredTree,
  isNormalTreeDonation,
  isGiftContribution,
}: SingleMarkerUnitsProps) => {
  const { t, ready } = useTranslation(['me']);
  return ready ? (
    <div className={MyForestMapStyle.trees}>
      {t(isConservation || isRestorationTreePlantation ? 'me:area' : '', {
        areaConserved: units,
      })}
      {t(
        isNormalTreeDonation || isRegisteredTree || isGiftContribution
          ? 'me:plantedTrees'
          : '',
        {
          count: units,
        }
      )}
    </div>
  ) : (
    <></>
  );
};

export default SingleMarkerUnits;
