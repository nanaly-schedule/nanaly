import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function CheckIcon({ size, color }: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11L9.33333 16L20 6"
        stroke={color ? color : '#3B82F6'}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
