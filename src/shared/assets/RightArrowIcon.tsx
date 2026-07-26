import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function RightArrowIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 7L15 12L10 17"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
