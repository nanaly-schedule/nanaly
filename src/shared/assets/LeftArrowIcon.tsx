import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function LeftArrowIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 8 14"
      fill="none"
    >
      <Path
        d="M6.625 12.625L0.625 6.625L6.625 0.625"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
