import { IconProps } from '../../../../../../src/features/common/types/common';

const NaturalRegeneration = ({ width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 42 49"
      width={width}
    >
      <path
        d="M6.2 6C-2 14-2 27 6.2 35.1l13.7 13.5c.6.6 1.6.6 2.2 0l13.7-13.5c8.2-8 8.2-21 0-29.1-8.2-8-21.4-8-29.6 0-.1 0 0 0 0 0z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: `${color}`,
        }}
      />
      <path
        d="M23.1 23.6c1.2.4 2.9 1.1 5.1-1.3 2.8-3 3.3-6.5 3.3-7.9 0-.2-.2-.4-.4-.4-1.3.1-5.1.3-8 3.3-2.2 2.3-1.8 3.8-1.4 4.4 1.5-1.8 3.7-3.5 6.3-4.5-.9.6-2.9 2.1-4.5 3.7-1.3 1.3-2.4 2.8-3.1 4.4-.4-1.1-1.2-2.4-2.3-3.7-1.5-1.7-3.5-3.3-4.3-3.8 2.6 1.1 4.6 2.8 6.1 4.6.5-.7.9-2-1.2-4.4-2.7-3.1-6.4-3.4-7.7-3.6-.2 0-.4.2-.4.4 0 1.3.3 4.9 3 7.9 1.9 2.1 3.4 1.9 4.6 1.5.4.6 1.4 2 1.4 3.9-2.2.3-4.1 1.2-5.1 2.6-.2.3 0 .7.3.7h11.9c.4 0 .5-.4.3-.7-1.1-1.4-3-2.4-5.3-2.6-.2-2.4.8-3.7 1.4-4.5z"
        style={{
          fill: '#fff',
        }}
      />
    </svg>
  );
};

export default NaturalRegeneration;
