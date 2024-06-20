import { useTranslations } from 'next-intl';
import style from '../MyForestV2.module.scss';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

const ContributionInfoList = ({
  superclusterResponse,
}: {
  superclusterResponse: PointFeature<DonationProperties>;
}) => {
  const tProfile = useTranslations('Profile');

  const contributionCount =
    superclusterResponse.properties.contributionInfo.contributionCount;
  const latestContributions =
    superclusterResponse.properties.contributionInfo.latestContributions;

  return contributionCount === 1 ? (
    <></>
  ) : (
    <div className={style.listOfContributionsContainer}>
      {latestContributions.slice(0, 3).map((singleContribution, key) => {
        return (
          <div className={style.contributionInfoContainer} key={key}>
            <p className={style.trees}>
              {' '}
              {tProfile('myForestMap.plantedTree', {
                count: Number.isInteger(singleContribution.quantity)
                  ? singleContribution.quantity
                  : singleContribution.quantity.toFixed(2),
              })}
            </p>
            <p className={style.contributionDate}>
              {format(Number(singleContribution.plantDate), 'PP', {
                locale:
                  localeMapForDate[localStorage.getItem('language') || 'en'],
              })}{' '}
            </p>
          </div>
        );
      })}

      {contributionCount >= 4 && (
        <div className={style.totalContribution}>
          {tProfile('donatePopup.totalContribution', {
            count: Number(contributionCount) - 3,
          })}
        </div>
      )}
    </div>
  );
};
export default ContributionInfoList;
