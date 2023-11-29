import {
  Contributions,
  BouquetContribution,
} from '../../../../common/types/myForest';
import { ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import ProjectImage from './ProjectImage';
import ProjectInfoAndContributionDate from './ProjectInfoAndContributionDate';
import TreesOrUnitAreaAndDonateOption from './TreesOrUnitAreaAndDonateOption';

export interface ProjectProps {
  projectInfo: Contributions | BouquetContribution;
}
const ContributedProject = ({ projectInfo }: ProjectProps): ReactElement => {
  return (
    <div className={myForestStyles.donationDetail}>
      <ProjectImage
        imageUniqueKey={projectInfo?.plantProject?.image}
        numberOfTreesPlanted={projectInfo?.treeCount}
      />
      <div className={myForestStyles.projectDetailContainer}>
        <ProjectInfoAndContributionDate
          projectName={
            projectInfo?.plantProject?.name ||
            projectInfo?.metadata?.project?.name
          }
          countryName={projectInfo?.plantProject?.country.toLowerCase()}
          tpoName={projectInfo?.plantProject?.tpo?.name}
          giftSenderName={projectInfo?.metadata?.giver?.name}
          contributionDate={projectInfo?.plantDate || projectInfo?.created}
        />
        <TreesOrUnitAreaAndDonateOption
          projectUnit={projectInfo?.plantProject?.unit}
          projectPurpose={projectInfo?.purpose}
          areaQuantity={projectInfo.quantity}
          numberOfTreesPlanted={projectInfo?.treeCount || projectInfo?.value}
          contributionType={projectInfo.contributionType}
          gift={projectInfo?.type === 'gift'}
          tenantId={projectInfo?.tenant?.guid}
          projectGUID={projectInfo?.plantProject?.guid}
        />
      </div>
    </div>
  );
};

export default ContributedProject;
