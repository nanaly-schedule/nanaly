import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function SearchIcon({ size, color }: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M15.7511 15.7501L12.4961 12.4951"
        stroke={color ?? '#333333'}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
        stroke={color ?? '#333333'}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
