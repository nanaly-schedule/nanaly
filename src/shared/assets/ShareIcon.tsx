import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function ShareIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 5.66699V16.5003"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.3346 9.00033L12.0013 5.66699L8.66797 9.00033"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.33203 12V18.6667C5.33203 19.1087 5.50763 19.5326 5.82019 19.8452C6.13275 20.1577 6.55667 20.3333 6.9987 20.3333H16.9987C17.4407 20.3333 17.8646 20.1577 18.1772 19.8452C18.4898 19.5326 18.6654 19.1087 18.6654 18.6667V12"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
