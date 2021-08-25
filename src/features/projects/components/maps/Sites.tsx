import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import PlantLocations from './PlantLocations';
import ProjectPolygon from './ProjectPolygon';
import SatelliteLayer from './SatelliteLayer';
import VegetationChange from './VegetationChange';

interface Props {}

export default function Sites({}: Props): ReactElement {
  const {
    viewport,
    setViewPort,
    geoJson,
    selectedSite,
    isMobile,
    mapState,
    setMapState,
    mapRef,
    selectedMode,
    rasterData,
    satellite,
    setSiteViewPort
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    let isPortrait = true;
    if (screen.orientation) {
      isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;
    } else if (window.orientation) {
      isPortrait = window.orientation === 0 || window.orientation === 180;
    }  
    const isMobileTemp = window.innerWidth <= 767 && isPortrait;
    //console.log("Projects-isMobileTemp", isMobileTemp, window.innerHeight, window.innerWidth, window.orientation, screen.orientation);
    zoomToProjectSite(
      geoJson,
      selectedSite,
      viewport,
      isMobileTemp,
      setViewPort,
      setSiteViewPort,
      4000
    );
  }, [selectedSite,selectedMode]);

  return (
    <>
      {selectedMode === 'location' && (
        <>
          {satellite && <SatelliteLayer />}
          {/* <ProjectPolygon id="locationPolygon" geoJson={geoJson} /> */}
        </>
      )}
      {Object.keys(rasterData.imagery).length !== 0 &&
        rasterData.imagery.constructor === Object && (
          <>
            {selectedMode === 'vegetation' && (
              <VegetationChange rasterData={rasterData} />
            )}
          </>
        )}
    </>
  );
}
