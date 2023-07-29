import React, { useContext } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../ProjectDetails/PlantedTreesButton';
import ConservationButton from '../ProjectDetails/ConservationButton';
import DonationInfo from '../ProjectDetails/DonationInfo';
import TreeContributedProjectList from '../ProjectDetails/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../ProjectDetails/AreaConservedProjectList';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import { Purpose } from '../../../../../utils/constants/myForest';
import { Contributions } from '../../../../common/types/contribution';
import { QueryResult } from '../../../../../server/router/myForest';
import { MyTreesProps } from '../../../../common/types/map';

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

export default function MyTrees({
  profile,
  authenticatedType,
}: MyTreesProps): React.ReactElement | null {
  const { ready } = useTranslation(['country', 'me']);
  const [contribution, setContribution] = React.useState<Contributions[]>([]);
  const [otherDonationInfo, setOthercontributionInfo] = React.useState<
    QueryResult[]
  >([]);
  const [page, setPage] = React.useState(0);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const {
    setConservationProjects,
    setTreePlantedProjects,
    isConservedButtonActive,
    isTreePlantedButtonActive,
  } = useContext(ProjectPropsContext);

  const _detailInfo = trpc.myForest.stats.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
  });

  const _conservationGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
    purpose: Purpose.CONSERVATION,
  });

  const _treePlantedData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
    purpose: Purpose.TREES,
  });

  const _contributionData = trpc.myForest.contributions.useInfiniteQuery(
    {
      profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
      limit: 15,
      purpose: isConservedButtonActive ? Purpose.CONSERVATION : Purpose.TREES,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const handleFetchNextPage = (): void => {
    _contributionData.fetchNextPage();
    setPage((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (!_contributionData.isLoading) {
      if (_contributionData.error) {
        setErrors(
          handleError(
            new APIError(
              _contributionData.error?.data?.httpStatus as number,
              _contributionData.error
            )
          )
        );
      }

      setContribution(_contributionData.data?.pages);
    }
  }, [_contributionData.isLoading, _contributionData.data]);

  React.useEffect(() => {
    if (!_conservationGeoJsonData.isLoading) {
      if (_conservationGeoJsonData.error) {
        setErrors(
          handleError(
            new APIError(
              _conservationGeoJsonData.error?.data?.httpStatus as number,
              _conservationGeoJsonData.error
            )
          )
        );
      } else {
        setConservationProjects(_conservationGeoJsonData.data);
      }
    }
  }, [_conservationGeoJsonData.isLoading]);

  React.useEffect(() => {
    if (!_treePlantedData.isLoading) {
      if (_treePlantedData.error) {
        setErrors(
          handleError(
            new APIError(
              _treePlantedData.error?.data?.httpStatus as number,
              _treePlantedData.error
            )
          )
        );
      } else {
        setTreePlantedProjects(_treePlantedData.data);
      }
    }
  }, [_treePlantedData.isLoading]);

  React.useEffect(() => {
    if (!_detailInfo.isLoading) {
      if (_detailInfo.error) {
        setErrors(
          handleError(
            new APIError(
              _detailInfo.error?.data?.httpStatus as number,
              _detailInfo.error
            )
          )
        );
      } else {
        setOthercontributionInfo(_detailInfo.data);
      }
    }
  }, [_detailInfo.isLoading]);

  return ready && otherDonationInfo ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap />
      <div className={myForestStyles.mapButtonMainContainer}>
        <div className={myForestStyles.mapButtonContainer}>
          <PlantedTreesButton plantedTrees={otherDonationInfo?.treeCount} />
          <ConservationButton conservedArea={otherDonationInfo?.conserved} />
          <DonationInfo
            projects={otherDonationInfo?.projects}
            countries={otherDonationInfo?.countries}
            donations={otherDonationInfo?.donations}
          />
        </div>
      </div>

      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={contribution}
          userprofile={profile}
          authenticatedType={authenticatedType}
          handleFetchNextPage={handleFetchNextPage}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={contribution}
          handleFetchNextPage={handleFetchNextPage}
        />
      )}
    </div>
  ) : null;
}
