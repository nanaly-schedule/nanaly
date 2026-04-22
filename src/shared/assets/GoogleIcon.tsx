import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconSize } from '../types/assets';

export default function GoogleIcon({ size }: TypeIconSize) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G clipPath="url(#clip0_900_4508)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.5216 12.0807C23.5216 11.2431 23.4465 10.4377 23.3069 9.66455H12.1816V14.2338H18.5389C18.2651 15.7104 17.4328 16.9615 16.1818 17.7991V20.7629H19.9994C22.233 18.7065 23.5216 15.6782 23.5216 12.0807Z"
          fill="#4285F4"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.1817 23.6248C15.3711 23.6248 18.045 22.567 19.9994 20.7629L16.1818 17.7991C15.1241 18.5078 13.771 18.9266 12.1817 18.9266C9.10507 18.9266 6.50095 16.8487 5.57206 14.0566H1.62561V17.1172C3.5693 20.9777 7.56408 23.6248 12.1817 23.6248Z"
          fill="#34A853"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.57201 14.0571C5.33576 13.3483 5.20153 12.5913 5.20153 11.8127C5.20153 11.0341 5.33576 10.2771 5.57201 9.56833V6.50781H1.62556C0.825533 8.1025 0.369141 9.90659 0.369141 11.8127C0.369141 13.7188 0.825533 15.5229 1.62556 17.1176L5.57201 14.0571Z"
          fill="#FBBC05"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.1817 4.69816C13.916 4.69816 15.4731 5.29415 16.6973 6.46466L20.0853 3.07662C18.0396 1.17051 15.3657 0 12.1817 0C7.56408 0 3.5693 2.64708 1.62561 6.50762L5.57206 9.56813C6.50095 6.77608 9.10507 4.69816 12.1817 4.69816Z"
          fill="#EA4335"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_900_4508">
          <Rect width="23.625" height="23.625" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
