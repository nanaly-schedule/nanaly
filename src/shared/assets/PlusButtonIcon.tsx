import Svg, {
  Circle,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
} from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function PlusButtonIcon({
  size,
  color = '#3B82F6',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 76 76"
      fill="none"
    >
      <G filter="url(#plusButtonShadow)">
        <Circle cx={38} cy={34} r={26} fill={color} />
      </G>
      <Path
        d="M24 34.002H52"
        stroke="#F7F7F7"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M38.0039 20L38.0039 48"
        stroke="#F7F7F7"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Defs>
        <Filter
          id="plusButtonShadow"
          x="0"
          y="0"
          width="76"
          height="76"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="4" />
          <FeGaussianBlur stdDeviation="6" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0588235 0 0 0 0 0.0901961 0 0 0 0 0.164706 0 0 0 0.06 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1530_38438"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1530_38438"
            result="shape"
          />
        </Filter>
      </Defs>
    </Svg>
  );
}
