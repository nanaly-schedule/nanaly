import { getMyStore } from '@/src/features/store/api/store';

type RouterLike = {
  replace: (href: any) => void;
};

export async function replaceToInitialRoute(router: RouterLike) {
  try {
    const { data: myStores } = await getMyStore();
    const firstStore = myStores[0];

    if (!firstStore) {
      router.replace('/store');
      return;
    }

    router.replace(`/${firstStore.storeId}`);
  } catch {
    router.replace('/store');
  }
}
