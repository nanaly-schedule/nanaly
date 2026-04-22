import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function EyeOffIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path
        d="M12.5001 15.0001L11.8984 12.2917"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.6665 6.66675C2.29013 8.37573 3.42411 9.85166 4.91475 10.8945C6.4054 11.9373 8.18063 12.4967 9.99984 12.4967C11.819 12.4967 13.5943 11.9373 15.0849 10.8945C16.5756 9.85166 17.7095 8.37573 18.3332 6.66675"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.6668 12.5001L15.2285 10.7917"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.3335 12.5001L4.77183 10.7917"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.5 15.0001L8.10167 12.2917"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
