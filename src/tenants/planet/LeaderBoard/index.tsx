import React, { ReactElement } from 'react';
import Footer from '../../../features/common/Layout/Footer';
import Score from './components/Score';
import Stats from './components/Stats';
import Stories from './components/Stories';
import {
  LeaderBoardList,
  TenantScore,
  TreesDonated,
} from '../../../features/common/types/leaderboard';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
  treesDonated: TreesDonated | null;
}

export default function index({
  leaderboard,
  tenantScore,
  treesDonated,
}: Props): ReactElement {
  return (
    <div>
      <Score leaderboard={leaderboard} />
      {(tenantScore && treesDonated) && <Stats tenantScore={tenantScore} treesDonated={treesDonated}/>}
      <Stories />
      <Footer />
    </div>
  );
}
