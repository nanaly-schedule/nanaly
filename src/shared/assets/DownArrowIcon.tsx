import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function DownArrowIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 9L12 15L6 9"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
