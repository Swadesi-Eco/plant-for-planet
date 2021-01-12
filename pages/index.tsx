import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/projects/screens/Projects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../src/utils/apiRequests/api';
import DirectGift from '../src/features/donations/components/treeDonation/DirectGift';

interface Props {
  initialized: Boolean;
  projects: any;
  setProject: Function;
  setProjects: Function;
  setShowSingleProject: Function;
  showProjects: Boolean;
  setShowProjects: Function;
  setsearchedProjects: any;
  currencyCode: any;
  setCurrencyCode: Function;
}

export default function Donate({
  initialized,
  projects,
  setProject,
  setProjects,
  setShowSingleProject,
  showProjects,
  setShowProjects,
  setsearchedProjects,
  currencyCode,
  setCurrencyCode
}: Props) {
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');
  const [directGift, setDirectGift] = React.useState(null);
  const [showdirectGift, setShowDirectGift] = React.useState(true);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
  }, []);

  React.useEffect(() => {
    if (directGift) {
      if (directGift.show === false) {
        setShowDirectGift(false);
      }
    }
  }, [directGift]);

  // Deprecation Notice: This route will be removed in next major version
  React.useEffect(() => {
    if (router.query.p) {
      router.push('/[p]', `/${router.query.p}`, {
        shallow: true,
      });
    }
  }, [router]);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        const projects = await getRequest(
          `/app/projects?_scope=map&currency=${currency}`,
        );
        setProjects(projects);
        setProject(null);
        setShowSingleProject(false);        
      }
    }
    loadProjects();
  }, [currencyCode]);
  
  const ProjectsProps = {
    projects,
    showProjects,
    setShowProjects,
    setsearchedProjects,
  };

  const GiftProps = {
    setShowDirectGift,
    directGift,
  };

  return (
    <>
      {initialized ? (
        projects && initialized ? (
          <>
          <GetAllProjectsMeta />
            <ProjectsList {...ProjectsProps} />
            {directGift ? (
              showdirectGift ? (
                <DirectGift {...GiftProps} />
              ) : null
            ) : null}
          </>
        ) : (
          <></>
        )
      ) : null}
    </>
  );
}
