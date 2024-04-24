import { IconProps } from '../../features/common/types/common';

const UpArrow = ({ width }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 7 5"
      fill="none"
    >
      <path
        d="M-5.49322e-08 3.87165C-2.45829e-08 4.2188 0.291516 4.49961 0.651907 4.49961C0.824895 4.49961 0.991477 4.43327 1.11321 4.31601L3.4998 2.01707L5.88639 4.31601C6.14107 4.56133 6.55432 4.56133 6.80899 4.31601C7.06367 4.07068 7.06367 3.67261 6.80899 3.42729L3.9611 0.683992C3.70642 0.438669 3.29317 0.43867 3.0385 0.683992L0.190607 3.42729C0.0688748 3.54455 -6.94998e-08 3.70502 -5.49322e-08 3.87165Z"
        fill="white"
      />
    </svg>
  );
};

export default UpArrow;
