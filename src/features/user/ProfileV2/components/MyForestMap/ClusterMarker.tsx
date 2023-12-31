import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
  RestoredSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';
import theme from '../../../../../theme/themeProperties';

export const TreePlantedClusterMarker = ({
  geoJson,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <>
      {geoJson?.properties?.totalContribution > 1 && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            {geoJson?.properties?.plantProject?.unitType === 'm2' ? (
              <RestoredSvg color={`${primaryDarkColorX}`} />
            ) : (
              <PlantedTreesSvg color={`${primaryDarkColorX}`} />
            )}
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {geoJson?.properties?.plantProject &&
            geoJson?.properties?.plantProject?.unitType === 'm2'
              ? t('me:area', {
                  areaConserved: parseInt(geoJson.properties.quantity),
                })
              : t('me:plantedTrees', {
                  count:
                    geoJson.properties.totalTrees ||
                    parseInt(geoJson.properties.quantity) ||
                    0,
                })}
          </div>
        </div>
      </Marker>
    </>
  ) : (
    <></>
  );
};

export const ConservAreaClusterMarker = ({
  geoJson,
}: MarkerProps): ReactElement => {
  const { lightBlueColor } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <div>
      {geoJson.id === undefined && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: `${lightBlueColor}` }}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <ConservationTreeSvg color={`${lightBlueColor}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', {
              areaConserved: `${
                geoJson.properties.totalTrees || geoJson.properties.quantity
              }`,
            })}
          </div>
        </div>
      </Marker>
    </div>
  ) : (
    <></>
  );
};
