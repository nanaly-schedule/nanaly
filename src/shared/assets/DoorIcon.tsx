import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function DoorIcon({
  size,
  color = '#434343',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={(size * 32) / 30}
      viewBox="0 0 30 32"
      fill="none"
    >
      <Path
        d="M13.7503 25H7.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.75 5.7025V25.8988C13.7501 26.0886 13.7934 26.276 13.8766 26.4466C13.9599 26.6173 14.081 26.7667 14.2306 26.8836C14.3802 27.0004 14.5545 27.0817 14.7403 27.1211C14.926 27.1606 15.1183 27.1572 15.3025 27.1113L23.75 25V6.9525C23.7499 6.39501 23.5635 5.85355 23.2204 5.41417C22.8772 4.97478 22.3971 4.66269 21.8563 4.5275L16.8562 3.2775C16.4878 3.18541 16.1032 3.17846 15.7317 3.2572C15.3602 3.33593 15.0115 3.49827 14.7121 3.73189C14.4127 3.96552 14.1704 4.26429 14.0037 4.60552C13.837 4.94675 13.7502 5.32273 13.75 5.7025Z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.75 5H10C9.33696 5 8.70107 5.26339 8.23223 5.73223C7.76339 6.20107 7.5 6.83696 7.5 7.5V25"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
