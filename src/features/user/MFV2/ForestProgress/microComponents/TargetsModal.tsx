import { Modal } from '@mui/material';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useContext } from 'react';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { handleError, APIError, User } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { SetState } from '../../../../common/types/common';
import { useTranslations } from 'next-intl';
import CrossIcon from '../../../../../../public/assets/images/icons/manageProjects/Cross';
import TargetFormInput from './TargetFormInput';
import { useState } from 'react';

interface TargetsModalProps {
  open: boolean;
  setOpen: SetState<boolean>;
}

const TargetsModal = ({ open, setOpen }: TargetsModalProps) => {
  const {
    setIsTargetModalLoading,
    isTargetModalLoading,
    treeTarget,
    restoreTarget,
    conservTarget,
    treeChecked,
    setTreeChecked,
    restoreChecked,
    setRestoreChecked,
    conservChecked,
    setConservChecked,
  } = useMyForestV2();
  const {
    user,
    contextLoaded,
    token,
    logoutUser,
    setUser,
    setRefetchUserData,
  } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const tProfile = useTranslations('Profile');
  const { tenantConfig } = useTenant();
  // local target state for modal
  const [targetForTree, setTargetForTree] = useState(0);
  const [targetForRestoredArea, setTargetForRestoredArea] = useState(0);
  const [targetForConservedArea, setTargetForConservedArea] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const changeTarget = async () => {
    setIsTargetModalLoading(true);

    if (contextLoaded && token && open && !isTargetModalLoading) {
      const bodyToSend = {
        targets: {
          treesDonated: treeChecked ? targetForTree : 0,
          areaConserved: conservChecked ? targetForConservedArea : 0,
          areaRestored: restoreChecked ? targetForRestoredArea : 0,
        },
      };

      try {
        const res = await putAuthenticatedRequest<User>(
          tenantConfig?.id,
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        handleClose();
        const newUserInfo = {
          ...user,
          targets: {
            treesDonated: res.targets.treesDonated,
            areaConserved: res.targets.areaConserved,
            areaRestored: res.targets.areaRestored,
          },
        };
        setUser(newUserInfo);
        setRefetchUserData(true);
        setIsTargetModalLoading(false);
      } catch (err) {
        handleClose();
        setIsTargetModalLoading(false);
        setErrors(handleError(err as APIError));
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className={targetBarStyle.targetModalMainContainer}>
        <button
          className={targetBarStyle.crossIconContainer}
          onClick={handleClose}
        >
          <CrossIcon />
        </button>
        <div className={targetBarStyle.setTargetLabel}>
          {tProfile('progressBar.setTargets')}
        </div>

        <div className={targetBarStyle.targetModalSubConatiner}>
          <TargetFormInput
            dataType={'treesPlanted'}
            checked={treeChecked}
            setChecked={setTreeChecked}
            target={treeTarget}
            latestTarget={targetForTree}
            setLatestTarget={setTargetForTree}
          />
          <TargetFormInput
            dataType={'areaRestored'}
            checked={restoreChecked}
            setChecked={setRestoreChecked}
            target={restoreTarget}
            latestTarget={targetForRestoredArea}
            setLatestTarget={setTargetForRestoredArea}
          />
          <TargetFormInput
            dataType={'areaConserved'}
            checked={conservChecked}
            setChecked={setConservChecked}
            target={conservTarget}
            latestTarget={targetForConservedArea}
            setLatestTarget={setTargetForConservedArea}
          />
        </div>
        <button className={targetBarStyle.saveButton} onClick={changeTarget}>
          {isTargetModalLoading ? (
            <div className={'spinner'}></div>
          ) : (
            tProfile('progressBar.save')
          )}
        </button>
      </div>
    </Modal>
  );
};

export default TargetsModal;
