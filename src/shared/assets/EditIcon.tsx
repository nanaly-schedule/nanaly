import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function EditIcon({ size, color }: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M17.6462 5.67682C18.0868 5.23634 18.3344 4.63888 18.3345 4.01587C18.3346 3.39285 18.0871 2.79533 17.6467 2.35474C17.2062 1.91415 16.6087 1.66658 15.9857 1.6665C15.3627 1.66643 14.7652 1.91384 14.3246 2.35432L3.20291 13.4785C3.00943 13.6714 2.86634 13.9089 2.78625 14.1702L1.68541 17.7968C1.66388 17.8689 1.66225 17.9454 1.68071 18.0184C1.69916 18.0913 1.73701 18.1578 1.79024 18.211C1.84347 18.2641 1.9101 18.3019 1.98305 18.3202C2.05599 18.3386 2.13255 18.3368 2.20458 18.3152L5.83208 17.2152C6.09306 17.1358 6.33056 16.9936 6.52375 16.801L17.6462 5.67682Z"
        stroke={color ?? '#333333'}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12.5 4.1665L15.8333 7.49984"
        stroke={color ?? '#333333'}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
