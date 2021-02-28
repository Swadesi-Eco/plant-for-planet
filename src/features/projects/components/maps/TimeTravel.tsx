import React, { ReactElement } from 'react';
import mapboxgl from 'mapbox-gl';
import syncMove from '@mapbox/mapbox-gl-sync-move';
import MapboxCompare from 'mapbox-gl-compare';
import ImageDropdown from './ImageDropdown';

interface Props {
    rasterData: Object | null;
    mapRef: Object;
    geoJson: Object | null;
}

export default function TimeTravel({ rasterData, mapRef, geoJson }: Props): ReactElement {

    const [before, setBefore] = React.useState();
    const [after, setAfter] = React.useState();
    const [selectedSource1, setSelectedSource1] = React.useState('planetLabs');
    const [selectedSource2, setSelectedSource2] = React.useState('planetLabs');
    const [selectedYear1, setSelectedYear1] = React.useState('2017');
    const [selectedYear2, setSelectedYear2] = React.useState('2020');

    const EMPTY_STYLE = {
        version: 8,
        sources: {},
        layers: [],
    };

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            let center = mapRef.current.getMap().getCenter();
            let zoom = mapRef.current.getMap().getZoom();
            var before = new mapboxgl.Map({
                container: 'before', // Container ID
                style: EMPTY_STYLE,
                center: center,
                zoom: zoom
            });

            setBefore(before);

            var after = new mapboxgl.Map({
                container: 'after', // Container ID
                style: EMPTY_STYLE,
                center: center,
                zoom: zoom
            });

            setAfter(after);

            // Add zoom and rotation controls to the map.
            after.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

            // A selector or reference to HTML element
            var container = '#comparison-container';

            new MapboxCompare(before, after, container, {
                mousemove: false, // Optional. Set to true to enable swiping during cursor movement.
                orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
            });

            syncMove(before, after, mapRef.current.getMap());
        }
    }, []);

    React.useEffect(() => {
        function loadLayers() {
            // Planet Labs
            if (selectedSource1 === 'planetLabs') {
                rasterData.imagery.planetLabs.map((year: any) => {
                    if (year.year === selectedYear1) {
                        if (!before.getSource(`before-imagery-planet-${year.year}`)) {
                            before.addSource(`before-imagery-planet-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!before.getLayer(`before-imagery-planet-${year.year}-layer`)) {
                            before.addLayer({
                                id: `before-imagery-planet-${year.year}-layer`,
                                type: 'raster',
                                source: `before-imagery-planet-${year.year}`,
                            });
                        }

                        if (!before.getSource(`project-polygon-planet-${year.year}`)) {
                            before.addSource(`project-polygon-planet-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!before.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                            before.addLayer({
                                'id': `project-polygon-layer-planet-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-planet-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }


                    } else {
                        if (before.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                            before.removeLayer(`project-polygon-layer-planet-${year.year}`);
                        }
                        if (before.getLayer(`before-imagery-planet-${year.year}-layer`)) {
                            before.removeLayer(`before-imagery-planet-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.planetLabs.map((year: any) => {
                    if (before.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                        before.removeLayer(`project-polygon-layer-planet-${year.year}`);
                    }
                    if (before.getLayer(`before-imagery-planet-${year.year}-layer`)) {
                        before.removeLayer(`before-imagery-planet-${year.year}-layer`);
                    }
                });
            }

            if (selectedSource2 === 'planetLabs') {
                rasterData.imagery.planetLabs.map((year: any) => {

                    if (year.year === selectedYear2) {
                        if (!after.getSource(`after-imagery-planet-${year.year}`)) {
                            after.addSource(`after-imagery-planet-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!after.getLayer(`after-imagery-planet-${year.year}-layer`)) {
                            after.addLayer({
                                id: `after-imagery-planet-${year.year}-layer`,
                                type: 'raster',
                                source: `after-imagery-planet-${year.year}`,
                            });
                        }

                        if (!after.getSource(`project-polygon-planet-${year.year}`)) {
                            after.addSource(`project-polygon-planet-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!after.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                            after.addLayer({
                                'id': `project-polygon-layer-planet-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-planet-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }

                    } else {
                        if (after.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                            after.removeLayer(`project-polygon-layer-planet-${year.year}`);
                        }
                        if (after.getLayer(`after-imagery-planet-${year.year}-layer`)) {
                            after.removeLayer(`after-imagery-planet-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.planetLabs.map((year: any) => {
                    if (after.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                        after.removeLayer(`project-polygon-layer-planet-${year.year}`);
                    }
                    if (after.getLayer(`after-imagery-planet-${year.year}-layer`)) {
                        after.removeLayer(`after-imagery-planet-${year.year}-layer`);
                    }
                });
            }

            // Sentinel 
            if (selectedSource1 === 'sentinel') {
                rasterData.imagery.sentinel.map((year: any) => {
                    if (year.year === selectedYear1) {
                        if (!before.getSource(`before-imagery-sentinel-${year.year}`)) {
                            before.addSource(`before-imagery-sentinel-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!before.getLayer(`before-imagery-sentinel-${year.year}-layer`)) {
                            before.addLayer({
                                id: `before-imagery-sentinel-${year.year}-layer`,
                                type: 'raster',
                                source: `before-imagery-sentinel-${year.year}`,
                            });
                        }

                        if (!before.getSource(`project-polygon-sentinel-${year.year}`)) {
                            before.addSource(`project-polygon-sentinel-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!before.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                            before.addLayer({
                                'id': `project-polygon-layer-sentinel-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-sentinel-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }


                    } else {
                        if (before.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                            before.removeLayer(`project-polygon-layer-sentinel-${year.year}`);
                        }
                        if (before.getLayer(`before-imagery-sentinel-${year.year}-layer`)) {
                            before.removeLayer(`before-imagery-sentinel-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.sentinel.map((year: any) => {
                    if (before.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                        before.removeLayer(`project-polygon-layer-sentinel-${year.year}`);
                    }
                    if (before.getLayer(`before-imagery-sentinel-${year.year}-layer`)) {
                        before.removeLayer(`before-imagery-sentinel-${year.year}-layer`);
                    }
                });
            }

            if (selectedSource2 === 'sentinel') {
                rasterData.imagery.sentinel.map((year: any) => {

                    if (year.year === selectedYear2) {
                        if (!after.getSource(`after-imagery-sentinel-${year.year}`)) {
                            after.addSource(`after-imagery-sentinel-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!after.getLayer(`after-imagery-sentinel-${year.year}-layer`)) {
                            after.addLayer({
                                id: `after-imagery-sentinel-${year.year}-layer`,
                                type: 'raster',
                                source: `after-imagery-sentinel-${year.year}`,
                            });
                        }

                        if (!after.getSource(`project-polygon-sentinel-${year.year}`)) {
                            after.addSource(`project-polygon-sentinel-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!after.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                            after.addLayer({
                                'id': `project-polygon-layer-sentinel-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-sentinel-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }

                    } else {
                        if (after.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                            after.removeLayer(`project-polygon-layer-sentinel-${year.year}`);
                        }
                        if (after.getLayer(`after-imagery-sentinel-${year.year}-layer`)) {
                            after.removeLayer(`after-imagery-sentinel-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.sentinel.map((year: any) => {
                    if (after.getLayer(`project-polygon-layer-sentinel-${year.year}`)) {
                        after.removeLayer(`project-polygon-layer-sentinel-${year.year}`);
                    }
                    if (after.getLayer(`after-imagery-sentinel-${year.year}-layer`)) {
                        after.removeLayer(`after-imagery-sentinel-${year.year}-layer`);
                    }
                });
            }

            // Landsat
            if (selectedSource1 === 'landsat') {
                rasterData.imagery.landsat.map((year: any) => {
                    if (year.year === selectedYear1) {
                        if (!before.getSource(`before-imagery-landsat-${year.year}`)) {
                            before.addSource(`before-imagery-landsat-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!before.getLayer(`before-imagery-landsat-${year.year}-layer`)) {
                            before.addLayer({
                                id: `before-imagery-landsat-${year.year}-layer`,
                                type: 'raster',
                                source: `before-imagery-landsat-${year.year}`,
                            });
                        }

                        if (!before.getSource(`project-polygon-landsat-${year.year}`)) {
                            before.addSource(`project-polygon-landsat-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!before.getLayer(`project-polygon-layer-landsat-${year.year}`)) {
                            before.addLayer({
                                'id': `project-polygon-layer-landsat-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-landsat-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }


                    } else {
                        if (before.getLayer(`project-polygon-layer-landsat-${year.year}`)) {
                            before.removeLayer(`project-polygon-layer-landsat-${year.year}`);
                        }
                        if (before.getLayer(`before-imagery-landsat-${year.year}-layer`)) {
                            before.removeLayer(`before-imagery-landsat-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.landsat.map((year: any) => {
                    if (before.getLayer(`project-polygon-layer-landsat-${year.year}`)) {
                        before.removeLayer(`project-polygon-layer-landsat-${year.year}`);
                    }
                    if (before.getLayer(`before-imagery-landsat-${year.year}-layer`)) {
                        before.removeLayer(`before-imagery-landsat-${year.year}-layer`);
                    }
                });
            }

            if (selectedSource2 === 'landsat') {
                rasterData.imagery.landsat.map((year: any) => {

                    if (year.year === selectedYear2) {
                        if (!after.getSource(`after-imagery-${year.year}`)) {
                            after.addSource(`after-imagery-${year.year}`, {
                                type: 'raster',
                                tiles: [`${year.raster}`],
                                tileSize: 256,
                                attribution: 'layer attribution',
                            });
                        }
                        if (!after.getLayer(`after-imagery-${year.year}-layer`)) {
                            after.addLayer({
                                id: `after-imagery-${year.year}-layer`,
                                type: 'raster',
                                source: `after-imagery-${year.year}`,
                            });
                        }

                        if (!after.getSource(`project-polygon-${year.year}`)) {
                            after.addSource(`project-polygon-${year.year}`, {
                                'type': 'geojson',
                                'data': geoJson
                            });
                        }

                        if (!after.getLayer(`project-polygon-layer-${year.year}`)) {
                            after.addLayer({
                                'id': `project-polygon-layer-${year.year}`,
                                'type': 'line',
                                'source': `project-polygon-${year.year}`,
                                'layout': {},
                                'paint': {
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }
                            });
                        }

                    } else {
                        if (after.getLayer(`project-polygon-layer-${year.year}`)) {
                            after.removeLayer(`project-polygon-layer-${year.year}`);
                        }
                        if (after.getLayer(`after-imagery-${year.year}-layer`)) {
                            after.removeLayer(`after-imagery-${year.year}-layer`);
                        }
                    }
                })
            } else {
                rasterData.imagery.landsat.map((year: any) => {
                    if (after.getLayer(`project-polygon-layer-landsat-${year.year}`)) {
                        after.removeLayer(`project-polygon-layer-landsat-${year.year}`);
                    }
                    if (after.getLayer(`after-imagery-landsat-${year.year}-layer`)) {
                        after.removeLayer(`after-imagery-landsat-${year.year}-layer`);
                    }
                });
            }

        }
        if (before && after) {

            try {
                setTimeout(function () {
                    loadLayers();
                }, 1000);
            } catch (e) {
                console.log("Error adding layer", e);
            }
        }

    }, [before, after, selectedYear1, selectedYear2, selectedSource1, selectedSource2]);

    const imageDropdownProps = {
        selectedYear1, selectedYear2, setSelectedYear1, setSelectedYear2, rasterData, selectedSource1, setSelectedSource1, selectedSource2, setSelectedSource2
    }
    return (
        <>
            <ImageDropdown {...imageDropdownProps} />
            <div id="comparison-container">
                <div className="comparison-map" id="before"></div>
                <div className="comparison-map" id="after"></div>
            </div>
        </>
    )
}
