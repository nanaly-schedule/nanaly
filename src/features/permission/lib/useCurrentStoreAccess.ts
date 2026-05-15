import useUser from '@/src/features/user/lib/useUser';

import { getCurrentStoreAccess } from './access';

export default function useCurrentStoreAccess() {
  const currentStoreRole = useUser((state) => state.currentStoreRole);
  const currentStorePermissions = useUser(
    (state) => state.currentStorePermissions,
  );

  return getCurrentStoreAccess({
    role: currentStoreRole,
    permissions: currentStorePermissions,
  });
}
