import { Marker } from 'react-map-gl-v7';
import { useMemo } from 'react';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import themeProperties from '../../../../../theme/themeProperties';
import style from '.././Common/common.module.scss';
import { UnitTypes, ProjectPurpose } from '@planet-sdk/common';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/Conservation';
import { TreeProjectClassification } from '@planet-sdk/common';
import { AnyProps, PointFeature } from 'supercluster';

interface ProjectTypeIconProps {
  purpose: ProjectPurpose;
  classification: TreeProjectClassification | null;
  unitType: UnitTypes;
}

interface SinglePointMarkersProps {
  superclusterResponse: PointFeature<AnyProps>;
}
const ProjectTypeIcon = ({
  purpose,
  classification,
  unitType,
}: ProjectTypeIconProps) => {
  const getMarkerColor = (purpose: ProjectPurpose, unitType: UnitTypes) => {
    switch (purpose) {
      case 'conservation':
        return themeProperties.mediumBlueColor;
      case 'trees':
        return unitType === 'm2'
          ? themeProperties.electricPurpleColor
          : themeProperties.primaryDarkColorX;
      default:
        return themeProperties.primaryDarkColorX;
    }
  };
  const markerColor = useMemo(
    () => getMarkerColor(purpose, unitType),
    [purpose, unitType]
  );
  const IconProps = {
    width: 42,
    color: markerColor,
  };

  if (purpose === 'conservation') {
    return <Conservation {...IconProps} />;
  }

  switch (classification) {
    case 'natural-regeneration':
      return <NaturalRegeneration {...IconProps} />;
    case 'mangroves':
      return <Mangroves {...IconProps} />;
    case 'managed-regeneration':
      return <ManagedRegeneration {...IconProps} />;
    case 'agroforestry':
      return <Agroforestry {...IconProps} />;
    case 'urban-planting':
      return <UrbanRestoration {...IconProps} />;
    case 'large-scale-planting':
    case 'other-planting':
      return <TreePlanting {...IconProps} />;
    default:
      return null;
  }
};

const SinglePointMarkers = ({
  superclusterResponse,
}: SinglePointMarkersProps) => {
  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
      offset={[0, -15]}
    >
      {superclusterResponse?.properties.type === 'registration' ? (
        <div className={style.registeredTreeMarkerContainer}>
          <RegisteredTreeIcon />
        </div>
      ) : (
        <ProjectTypeIcon
          purpose={superclusterResponse.properties.projectInfo.purpose}
          classification={
            superclusterResponse.properties.projectInfo.classification
          }
          unitType={superclusterResponse.properties.projectInfo.unitType}
        />
      )}
    </Marker>
  );
};

export default SinglePointMarkers;
