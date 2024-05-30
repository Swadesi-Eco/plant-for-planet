import { Marker } from 'react-map-gl-v7';
import { useMemo } from 'react';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import OtherPlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/OtherPlanting';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import style from '.././Common/common.module.scss';
import { TreeProjectClassification } from '@planet-sdk/common';

interface ProjectTypeIconProps {
  purpose: 'trees' | 'conservation';
  classification: TreeProjectClassification | null;
  unitType: 'tree' | 'm2';
}

const ProjectTypeIcon = ({
  purpose,
  classification,
  unitType,
}: ProjectTypeIconProps) => {
  const getMarkerColor = (
    purpose: 'trees' | 'conservation',
    unitType: 'tree' | 'm2'
  ) => {
    switch (purpose) {
      case 'conservation':
        return themeProperties.mediumBlue;
      case 'trees':
        return unitType === 'm2'
          ? themeProperties.electricPurple
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
      return <TreePlanting {...IconProps} />;
    case 'other-planting':
      return <OtherPlanting {...IconProps} />;
    default:
      return null;
  }
};

const SinglePointMarkers = () => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  return registrationGeojson ? (
    <>
      {registrationGeojson.map((singleLocation, key) => {
        if (singleLocation.geometry !== undefined) {
          return (
            <Marker
              longitude={singleLocation?.geometry.coordinates[0]}
              latitude={singleLocation?.geometry.coordinates[1]}
              anchor="bottom"
              offset={[0, 0]}
              key={key}
            >
              <div className={style.registeredTreeMarkerContainer}>
                <RegisteredTreeIcon />
              </div>
            </Marker>
          );
        } else {
          return <></>;
        }
      })}
      {donationGeojson.map((singleLocation, key) => {
        return (
          <Marker
            longitude={singleLocation?.geometry.coordinates[0]}
            latitude={singleLocation?.geometry.coordinates[1]}
            anchor="bottom"
            offset={[0, 0]}
            key={key}
          >
            <ProjectTypeIcon
              purpose={singleLocation.properties.projectInfo.purpose}
              classification={
                singleLocation.properties.projectInfo.classification
              }
              unitType={singleLocation.properties.projectInfo.unitType}
            />
          </Marker>
        );
      })}
    </>
  ) : (
    <></>
  );
};

export default SinglePointMarkers;
