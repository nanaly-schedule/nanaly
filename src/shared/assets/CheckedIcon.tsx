import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeFillIconProps } from '../types/assets';

export default function CheckedIcon({
  size,
  color = '#FFFFFF',
  fillColor = '#3DAF1E',
}: TypeFillIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <G clipPath="url(#clip0_900_50)">
        <Path
          d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
          fill={fillColor}
          stroke={fillColor}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6 7.99996L7.33333 9.33329L10 6.66663"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_900_50">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
