import PageLayout from '@/src/shared/ui/PageLayout';
import InviteCodeWidget from '@/src/widgets/store/InviteCodeWidget';
import StoreInfoBtn from '@/src/widgets/store/StoreInfoBtn';

export default function AdminHomePage() {
  return (
    <PageLayout showHeader={false}>
      <StoreInfoBtn />
      <InviteCodeWidget />
    </PageLayout>
  );
}
