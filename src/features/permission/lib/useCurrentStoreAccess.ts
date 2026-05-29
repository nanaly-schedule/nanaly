import useUser from '@/src/features/user/lib/useUser';

import { getCurrentStoreAccess } from './access';

export default function useCurrentStoreAccess() {
  const currentStoreAccessLoaded = useUser(
    (state) => state.currentStoreAccessLoaded,
  );
  const currentStoreRole = useUser((state) => state.currentStoreRole);
  const currentStorePermissions = useUser(
    (state) => state.currentStorePermissions,
  );

  return getCurrentStoreAccess({
    loaded: currentStoreAccessLoaded,
    role: currentStoreRole,
    permissions: currentStorePermissions,
  });
}
