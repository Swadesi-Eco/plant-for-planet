import React from 'react';
import { IconProps } from '../../../../src/features/common/types/common';

function Icon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path
        fill={props.color}
        d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 400H48V80h352v352zm-280-48h16c8.84 0 16-7.16 16-16V240c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v128c0 8.84 7.16 16 16 16zm96 0h16c8.84 0 16-7.16 16-16V144c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v224c0 8.84 7.16 16 16 16zm96 0h16c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16z"
      />
    </svg>
  );
}

export default Icon;
