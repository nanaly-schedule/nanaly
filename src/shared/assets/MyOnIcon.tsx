import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function MyOnIcon({
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
      <G clipPath="url(#myOnClip)">
        <Path
          d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z"
          fill={color}
          stroke={color}
          strokeLinejoin="round"
        />
        <Path
          d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21"
          fill={color}
        />
        <Path
          d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21"
          stroke={color}
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="myOnClip">
          <Rect width={24} height={24} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
