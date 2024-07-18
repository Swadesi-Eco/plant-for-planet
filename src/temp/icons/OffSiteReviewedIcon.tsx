import React from 'react';
import { IconProps } from '../../features/common/types/common';

const OffSiteReviewedIcon = ({ color, width }: IconProps) => {
  return (
    <svg
      width={width}
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.25289 5.08579C1.28785 5.10992 1.32551 5.13137 1.36585 5.14745C1.42771 5.17426 1.49227 5.19035 1.55682 5.19571C1.57833 5.19571 1.60254 5.19571 1.62406 5.19571H8.37769C8.74616 5.19571 9.04202 4.89812 9.04471 4.53083V0.664879C9.04471 0.297587 8.74616 0.00268097 8.37769 0H1.62406C1.60254 0 1.57833 0 1.55682 0C1.49227 0.00536193 1.42771 0.0241287 1.36585 0.0482574C1.32551 0.0643432 1.28785 0.0857909 1.25289 0.10992C1.1991 0.144772 1.15068 0.190349 1.11034 0.238606C1.01082 0.356568 0.957031 0.506702 0.957031 0.659517V4.53351C0.957031 4.68633 1.01082 4.83646 1.11034 4.95442C1.15068 5.00268 1.1991 5.04826 1.25289 5.08311V5.08579ZM1.62406 0.664879H8.37769V4.53351H1.62406V0.66756V0.664879Z"
        fill={color || '#fff'}
      />
      <path
        d="M9.80166 7.28667L9.42782 6.84667L8.81999 6H1.18447L0.132875 7.36333H0.138254C-0.122628 7.72 -0.00697952 8 0.423342 8H9.57843C10.0356 7.99667 10.1378 7.67667 9.80166 7.28667Z"
        fill={color || '#fff'}
      />
    </svg>
  );
};

export default OffSiteReviewedIcon;
