const StarIcon = ({ width, height, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
    >
      <path
        d="M5.83416 5.43102L7.29073 2.262C7.37142 2.08968 7.50861 1.95939 7.67807 1.88794C7.84753 1.81649 8.03717 1.81649 8.20663 1.87953C8.37609 1.94678 8.51731 2.07707 8.60204 2.24519L10.1353 5.38058C10.2442 5.60334 10.45 5.75464 10.688 5.79247L14.0329 6.25899C14.2145 6.28421 14.3799 6.38088 14.4969 6.52798C14.6139 6.67509 14.6744 6.86001 14.6664 7.05335C14.6583 7.24248 14.5816 7.42321 14.4525 7.5577L12.072 10.0374C11.9025 10.214 11.8259 10.4703 11.8662 10.7183L12.4755 14.1773C12.5077 14.3665 12.4714 14.5598 12.3746 14.7195C12.2778 14.8834 12.1244 15.0011 11.9469 15.0515C11.7694 15.102 11.5797 15.081 11.4183 14.9969L8.41644 13.3998C8.20259 13.2863 7.94437 13.2863 7.73456 13.4082L4.76494 15.0726C4.60355 15.165 4.41391 15.1902 4.23638 15.144C4.05885 15.0978 3.90149 14.9843 3.80062 14.8246C3.69975 14.6649 3.6594 14.4715 3.68764 14.2824L4.22024 10.8108C4.25655 10.5628 4.17586 10.3106 4.00236 10.1383L1.5613 7.71321C1.43219 7.57872 1.35149 7.39799 1.33535 7.20886C1.32325 7.01973 1.37973 6.83059 1.49271 6.67929C1.60568 6.52798 1.77111 6.43131 1.95268 6.40189L5.28946 5.85971C5.52752 5.82189 5.73329 5.65797 5.83416 5.43102Z"
        fill={color}
      />
    </svg>
  );
};

export default StarIcon;
