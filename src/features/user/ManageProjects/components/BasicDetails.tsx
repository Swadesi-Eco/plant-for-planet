import React, { ReactElement, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import styles from './../StepForm.module.scss';
import MapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import { MenuItem, TextField } from '@mui/material';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import {
  getFormattedNumber,
  parseNumber,
} from '../../../../utils/getFormattedNumber';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from '../../../../theme/themeContext';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import GeocoderArcGIS from 'geocoder-arcgis';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError, APIError, UnitTypes } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ProjectCreationTabs } from '..';
import {
  BasicDetailsProps,
  ProfileProjectConservation,
  ProfileProjectTrees,
  ViewPort,
} from '../../../common/types/project';

type FormData = {
  name: string;
  slug: string;
  website: string;
  description: string;
  acceptDonations: boolean;
  unitCost: string;
  latitude: string;
  longitude: string;
  metadata: {
    visitorAssistance: boolean;
    ecosystem: string;
  };
};

type TreeFormData = FormData & {
  classification: string;
  countTarget: string;
  unitType: 'tree' | 'm2';
};

type ConservationFormData = FormData;

export default function BasicDetails({
  handleNext,
  token,
  projectDetails,
  setProjectDetails,
  setProjectGUID,
  projectGUID,
  purpose,
}: BasicDetailsProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects']);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  const [IsSkipButtonVisible, setIsSkipButtonVisible] =
    React.useState<boolean>(false);

  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  // Map setup
  const { theme } = React.useContext(ThemeContext);
  const { logoutUser } = useUserProps();
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = React.useRef(null);
  const [style, setStyle] = React.useState(EMPTY_STYLE);
  const [wrongCoordinatesMessage, setWrongCoordinatesMessage] =
    React.useState<boolean>(false);
  const [viewport, setViewPort] = React.useState<ViewPort>({
    width: 760,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const router = useRouter();

  const { setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setStyle(result);
      }
    }
    loadMapStyle();
  }, []);

  const [projectCoords, setProjectCoords] = React.useState<number[]>([0, 0]);

  const changeLat = (e: any) => {
    if (e.target.value && e.target.value > -90 && e.target.value < 90) {
      setProjectCoords([
        projectCoords ? projectCoords[0] : 0,
        parseFloat(e.target.value),
      ]);
    }
  };
  const changeLon = (e: any) => {
    if (e.target.value && e.target.value > -180 && e.target.value < 180) {
      setProjectCoords([
        parseFloat(e.target.value),
        projectCoords ? projectCoords[1] : 0,
      ]);
    }
  };
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const classifications = [
    {
      label: ready ? t('manageProjects:largeScalePlanting') : '',
      value: 'large-scale-planting',
    },
    {
      label: ready ? t('manageProjects:agroforestry') : '',
      value: 'agroforestry',
    },
    {
      label: ready ? t('manageProjects:naturalRegeneration') : '',
      value: 'natural-regeneration',
    },
    {
      label: ready ? t('manageProjects:managedRegeneration') : '',
      value: 'managed-regeneration',
    },
    {
      label: ready ? t('manageProjects:urbanPlanting') : '',
      value: 'urban-planting',
    },
    {
      label: ready ? t('manageProjects:otherPlanting') : '',
      value: 'other-planting',
    },
  ];

  const ecosystemTypes = [
    'tropical-moist-forests',
    'tropical-dry-forests',
    'tropical-coniferous-forests',
    'tropical-grasslands-forests',
    'temperate-broadleaf-forests',
    'temperate-coniferous-forests',
    'temperate-grasslands-forests',
    'mediterranean-forests',
    'mangroves',
    'deserts',
    'flooded-grasslands',
    'montane-grasslands',
    'boreal-forests',
    'tundra',
  ];

  const unitTypeOptions: UnitTypes[] = ['tree', 'm2'];

  // Default Form Fields
  const defaultBasicDetails =
    purpose === 'trees'
      ? {
          name: '',
          slug: '',
          website: '',
          description: '',
          acceptDonations: false,
          unitCost: '',
          unitType: '',
          latitude: '',
          longitude: '',
          metadata: {
            ecosystem: '',
            visitorAssistance: false,
          },
          classification: '',
          countTarget: '',
        }
      : {
          name: '',
          slug: '',
          website: '',
          description: '',
          acceptDonations: false,
          unitCost: '',
          latitude: '',
          longitude: '',
          metadata: {
            ecosystem: '',
            visitorAssistance: false,
          },
        };

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TreeFormData | ConservationFormData>({
    mode: 'onBlur',
    defaultValues: defaultBasicDetails,
  });

  const [acceptDonations, setAcceptDonations] = useState(false);
  //if project is already had created then user can visit to  other forms using skip button
  React.useEffect(() => {
    if (projectDetails?.id) {
      setIsSkipButtonVisible(true);
    }
  }, [router]);

  React.useEffect(() => {
    if (projectDetails) {
      const basicDetails =
        purpose === 'trees'
          ? {
              name: projectDetails.name,
              slug: projectDetails.slug,
              website: projectDetails.website || '',
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitType: projectDetails.unitType,
              unitCost: getFormattedNumber(
                i18n.language,
                projectDetails.unitCost || 0
              ),
              latitude: projectDetails.geoLatitude.toString(),
              longitude: projectDetails.geoLongitude.toString(),
              metadata: {
                visitorAssistance:
                  projectDetails.metadata.visitorAssistance || false,
                ecosystem: projectDetails.metadata.ecosystem || '',
              },
              classification: projectDetails.classification || '',
              countTarget: projectDetails.countTarget || '',
            }
          : {
              name: projectDetails.name,
              slug: projectDetails.slug,
              website: projectDetails.website || '',
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitCost: getFormattedNumber(
                i18n.language,
                projectDetails.unitCost || 0
              ),
              latitude: projectDetails.geoLatitude.toString(),
              longitude: projectDetails.geoLongitude.toString(),
              metadata: {
                visitorAssistance:
                  projectDetails.metadata.visitorAssistance || false,
                ecosystem: projectDetails.metadata.ecosystem || '',
              },
            };
      if (projectDetails.geoLongitude && projectDetails.geoLatitude) {
        setProjectCoords([
          projectDetails.geoLongitude,
          projectDetails.geoLatitude,
        ]);
        setViewPort({
          ...viewport,
          latitude: projectDetails.geoLatitude,
          longitude: projectDetails.geoLongitude,
          zoom: 7,
        });
      }
      reset(basicDetails);
      if (projectDetails.acceptDonations) {
        setAcceptDonations(projectDetails.acceptDonations);
      }
    }
  }, [projectDetails]);

  const onSubmit = async (data: TreeFormData | ConservationFormData) => {
    setIsUploadingData(true);
    const submitData =
      purpose === 'trees'
        ? {
            name: data.name,
            slug: data.slug,
            website: data.website,
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(i18n.language, Number(data.unitCost))
              : undefined,
            unitType: (data as TreeFormData).unitType,
            currency: 'EUR',
            classification: (data as TreeFormData).classification,
            countTarget: Number((data as TreeFormData).countTarget),
            metadata: {
              ecosystem: data.metadata.ecosystem,
              visitorAssistance: data.metadata.visitorAssistance,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
          }
        : {
            purpose: 'conservation',
            name: data.name,
            slug: data.slug,
            website: data.website,
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(i18n.language, Number(data.unitCost))
              : undefined,
            currency: 'EUR',
            metadata: {
              ecosystem: data.metadata.ecosystem,
              visitorAssistance: data.metadata.visitorAssistance,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
          };

    // Check if GUID is set use update instead of create project
    if (projectGUID) {
      try {
        const res = await putAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation
        >(`/app/projects/${projectGUID}`, submitData, token, logoutUser);
        setProjectDetails(res);
        setIsUploadingData(false);
        handleNext(ProjectCreationTabs.PROJECT_MEDIA);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    } else {
      try {
        const res = await postAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation
        >(`/app/projects`, submitData, token, logoutUser);
        setProjectGUID(res.id);
        setProjectDetails(res);
        router.push(`/profile/projects/${res.id}?type=media`);
        setIsUploadingData(false);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );

  return ready ? (
    <CenteredContainer>
      <StyledForm>
        <div className="inputContainer">
          <Controller
            name="name"
            control={control}
            rules={{ required: t('manageProjects:nameValidation') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('manageProjects:name')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.name !== undefined}
                helperText={errors.name !== undefined && errors.name.message}
              />
            )}
          />
          <InlineFormDisplayGroup>
            <Controller
              name="metadata.ecosystem"
              rules={{
                required: t('manageProjects:ecosystemType'),
              }}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('manageProjects:ecosystem')}
                  variant="outlined"
                  select
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.metadata?.ecosystem !== undefined}
                  helperText={
                    errors.metadata?.ecosystem !== undefined &&
                    errors.metadata.ecosystem.message
                  }
                >
                  {ecosystemTypes.map((ecosystem) => (
                    <MenuItem key={ecosystem} value={ecosystem}>
                      {t(`manageProjects:ecosystemTypes.${ecosystem}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {purpose === 'trees' && (
              <Controller
                name="classification"
                rules={{
                  required: t('manageProjects:classificationValidation'),
                }}
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('manageProjects:classification')}
                    variant="outlined"
                    select
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={errors.classification !== undefined}
                    helperText={
                      errors.classification !== undefined &&
                      errors.classification?.message
                    }
                  >
                    {classifications.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}
          </InlineFormDisplayGroup>
          {purpose === 'trees' && (
            <InlineFormDisplayGroup>
              <Controller
                name="unitType"
                rules={{
                  required: t('manageProjects:unitTypeRequired'),
                }}
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('manageProjects:unitType')}
                    variant="outlined"
                    select
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={errors.unitType !== undefined}
                    helperText={
                      errors.unitType !== undefined && errors.unitType.message
                    }
                  >
                    {unitTypeOptions.map((unitType) => (
                      <MenuItem key={unitType} value={unitType}>
                        {t(`manageProjects:unitTypes.${unitType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="countTarget"
                control={control}
                rules={{
                  required: t('manageProjects:countTargetValidation'),
                  validate: (value) => parseInt(value, 10) > 1,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label={t('manageProjects:countTarget')}
                    variant="outlined"
                    placeholder={'0'}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      onChange(e);
                    }}
                    value={value}
                    onBlur={onBlur}
                    error={errors.countTarget !== undefined}
                    helperText={
                      errors.countTarget !== undefined &&
                      (errors.countTarget.message ||
                        t('manageProjects:countTargetValidation2'))
                    }
                  />
                )}
              />
            </InlineFormDisplayGroup>
          )}
          <InlineFormDisplayGroup>
            <Controller
              name="slug"
              control={control}
              rules={{ required: t('manageProjects:slugValidation') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={t('manageProjects:slug')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <p className={styles.inputStartAdornment}>pp.eco/</p>
                    ),
                  }}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.slug !== undefined}
                  helperText={errors.slug !== undefined && errors.slug.message}
                />
              )}
            />
            <Controller
              name="website"
              control={control}
              rules={{
                required: t('manageProjects:websiteValidationRequired'),
                pattern: {
                  //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
                  value:
                    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
                  message: t('manageProjects:websiteValidationInvalid'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={t('manageProjects:website')}
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.website !== undefined}
                  helperText={
                    errors.website !== undefined && errors.website.message
                  }
                />
              )}
            />
          </InlineFormDisplayGroup>
          <Controller
            name="description"
            control={control}
            rules={{
              required: t('manageProjects:aboutProjectValidation'),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('manageProjects:aboutProject')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.description !== undefined}
                helperText={
                  errors.description !== undefined && errors.description.message
                }
              />
            )}
          />
          <InlineFormDisplayGroup>
            <Controller
              name="acceptDonations"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  label={
                    <div>
                      {t('manageProjects:receiveDonations')}
                      <Tooltip
                        title={t('manageProjects:receiveDonationsInfo')}
                        arrow
                      >
                        <span className={styles.tooltipIcon}>
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    </div>
                  }
                  labelPlacement="end"
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                        setAcceptDonations(e.target.checked);
                      }}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  }
                />
              )}
            />
            {acceptDonations && (
              <Controller
                name="unitCost"
                control={control}
                rules={{
                  required: {
                    value: acceptDonations,
                    message: t('manageProjects:unitCostRequired'),
                  },
                  validate: (value) =>
                    parseNumber(i18n.language, Number(value)) > 0 &&
                    parseNumber(i18n.language, Number(value)) <= 100,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('manageProjects:unitCost')}
                    variant="outlined"
                    type="number"
                    placeholder={'0'}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    InputProps={{
                      startAdornment: (
                        <p
                          className={styles.inputStartAdornment}
                          style={{ paddingRight: '4px' }}
                        >{`€`}</p>
                      ),
                    }}
                    error={errors.unitCost !== undefined}
                    helperText={
                      errors.unitCost !== undefined &&
                      (errors.unitCost.message ||
                        t('manageProjects:invalidUnitCost'))
                    }
                  />
                )}
              />
            )}
          </InlineFormDisplayGroup>
          <div
            className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}
            style={{ width: '100%' }}
          >
            <p
              style={{
                backgroundColor:
                  theme === 'theme-light'
                    ? themeProperties.light.light
                    : themeProperties.dark.dark,
              }}
            >
              {t('manageProjects:projectLocation')}
            </p>
            <MapGL
              {...viewport}
              ref={mapRef}
              mapStyle={style}
              onViewportChange={_onViewportChange}
              onClick={(event) => {
                setProjectCoords(event.lngLat);
                const latLong = {
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                };
                geocoder
                  .reverse(`${latLong.longitude}, ${latLong.latitude}`, {
                    // longitude,latitude
                    maxLocations: 10,
                    distance: 100,
                  })
                  .then((result: any) => {
                    if (result?.address?.Type === 'Ocean') {
                      setWrongCoordinatesMessage(true);
                      setError('latitude', {
                        message: '',
                      });
                    } else {
                      setWrongCoordinatesMessage(false);
                      clearErrors('latitude');
                    }
                  })
                  .catch((error: string) => {
                    console.log(`error`, error);
                  });
                setViewPort({
                  ...viewport,
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                  transitionDuration: 400,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: d3.easeCubic,
                });
                setValue('latitude', latLong.latitude.toString());
                setValue('longitude', latLong.longitude.toString());
              }}
            >
              {projectCoords ? (
                <Marker
                  latitude={projectCoords[1]}
                  longitude={projectCoords[0]}
                  offsetLeft={5}
                  offsetTop={-16}
                  style={{ left: '28px' }}
                >
                  <div className={styles.marker}></div>
                </Marker>
              ) : null}
              <div className={styles.mapNavigation}>
                <NavigationControl showCompass={false} />
              </div>
            </MapGL>
            <div className={styles.basicDetailsCoordinatesContainer}>
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="latitude"
              >
                <Controller
                  name="latitude"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -90 && parseFloat(value) < 90,
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('manageProjects:latitude')}
                      variant="outlined"
                      className={styles.latitudeInput}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          top: '-6px',
                        },
                      }}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^0-9.-]/g,
                          ''
                        );
                        changeLat(e);
                        onChange(e);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={errors.latitude !== undefined}
                      helperText={
                        wrongCoordinatesMessage
                          ? t('manageProjects:wrongCoordinates')
                          : t('manageProjects:latitudeRequired')
                      }
                    />
                  )}
                />
              </div>
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="longitude"
              >
                <Controller
                  name="longitude"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -180 && parseFloat(value) < 180,
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('manageProjects:longitude')}
                      variant="outlined"
                      className={styles.longitudeInput}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          top: '-6px',
                        },
                      }}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^0-9.-]/g,
                          ''
                        );
                        changeLon(e);
                        onChange(e);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={errors.longitude !== undefined}
                      helperText={
                        errors.longitude !== undefined &&
                        t('manageProjects:longitudeRequired')
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Controller
            name="metadata.visitorAssistance"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t('manageProjects:visitorAssistanceLabel')}
                labelPlacement="end"
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => {
                      onChange(e.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
              />
            )}
          />
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            className="formButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:saveAndContinue')
            )}
          </Button>

          {IsSkipButtonVisible ? (
            <Button
              className="formButton"
              variant="contained"
              onClick={() => handleNext(ProjectCreationTabs.PROJECT_MEDIA)}
            >
              {t('manageProjects:skip')}
            </Button>
          ) : (
            ''
          )}
        </div>
      </StyledForm>
    </CenteredContainer>
  ) : (
    <></>
  );
}
