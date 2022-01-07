import Modal from '@material-ui/core/Modal';
import React, { ReactElement } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { ThemeContext } from '../../../theme/themeContext';
import DonationsPopup from '../../donations';
import { useRouter } from 'next/router';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import EditIcon from '../../../../public/assets/images/icons/manageProjects/Pencil';
import Link from 'next/link';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';

const { useTranslation } = i18next;
interface Props {
  project: any;
  key: number;
  editMode: Boolean;
}

export default function ProjectSnippet({
  project,
  key,
  editMode,
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const { theme } = React.useContext(ThemeContext);

  const { selectedPl, hoveredPl } = React.useContext(ProjectPropsContext);

  let progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleRedirect = () => {
    router.push(`${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${project.id}`);
  };

  return ready ? (
    <div className={'singleProject'} key={key}>
      <Modal
        className={`modalContainer ${theme}`}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <DonationsPopup project={project} onClose={handleClose} />
      </Modal>

      {editMode ? (
        <Link href={`/profile/projects/${project.id}`}>
          <button id={'projectSnipEdit'} className={'projectEditBlock'}>
            <EditIcon></EditIcon>
          </button>
        </Link>
      ) : null}
      <div
        onClick={() => {
          router.replace(`/${project.slug}`);
        }}
        className={`projectImage ${selectedPl || hoveredPl ? 'projectCollapsed' : ''
          }`}
      >
        {project.image && typeof project.image !== 'undefined' ? (
          <div
            className={'projectImageFile'}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}

        <div className={'projectImageBlock'}>
          <div className={'projectType'}>
            {project.classification && t(`donate:${project.classification}`)}
          </div>
          <div className={'projectName'}>
            {truncateString(project.name, 54)}
          </div>
        </div>
      </div>

      <div className={'progressBar'}>
        <div
          className={'progressBarHighlight'}
          style={{ width: progressPercentage + '%' }}
        />
      </div>
      <div className={'projectInfo'}>
        <div className={'projectData'}>
          <div className={'targetLocation'}>
            <div className={'target'}>
              {project.purpose === 'trees' ? (
                <>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(project.countPlanted),
                    1
                  )}{' '}
                  {t('common:tree', { count: Number(project.countPlanted) })} •{' '}
                </>
              ) : []}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div
            className={'projectTPOName'}
            onClick={() => {
              router.push(`/t/${project.tpo.slug}`);
            }}
          >
            {t('common:by', {
              tpoName: project.tpo.name,
            })}
          </div>
        </div>

        {project.allowDonations && (
          <div className={'projectCost'}>
            {project.treeCost ? (
              <>
                <button
                  id={`ProjSnippetDonate_${project.id}`}
                  onClick={
                    project.purpose === 'trees' ? handleOpen : handleRedirect
                  }
                  className={'donateButton'}
                  data-test-id="donateButton"
                >
                  {t('common:donate')}
                </button>
                <div className={'perTreeCost'}>
                  {getFormatedCurrency(
                    i18n.language,
                    project.currency,
                    project.treeCost
                  )}{' '}
                  <span>{project.purpose === 'conservation' ? t('donate:perM2') : t('donate:perTree')}</span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
