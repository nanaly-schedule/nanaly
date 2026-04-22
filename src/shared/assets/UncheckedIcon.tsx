import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function UncheckedIcon({
  size,
  color = '#575757',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
    >
      <G clipPath="url(#clip0_114_1734)">
        <Path
          d="M8.99967 15.6667C12.6816 15.6667 15.6663 12.6819 15.6663 9.00004C15.6663 5.31814 12.6816 2.33337 8.99967 2.33337C5.31778 2.33337 2.33301 5.31814 2.33301 9.00004C2.33301 12.6819 5.31778 15.6667 8.99967 15.6667Z"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7 8.99996L8.33333 10.3333L11 7.66663"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_114_1734">
          <Rect
            width="16"
            height="16"
            fill="white"
            transform="translate(1 1)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
