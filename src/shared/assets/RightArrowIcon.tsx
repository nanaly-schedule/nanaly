import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function RightArrowIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 7 12" fill="none">
      <Path
        d="M0.625 0.625L5.625 5.625L0.625 10.625"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
