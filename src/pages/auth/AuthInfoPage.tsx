import { useEffect, useState } from 'react';

import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
import {
  BirthDateValue,
  formatBirthDate,
  parseBirthDate,
} from '@/src/shared/lib/date';
import AuthInfo from '@/src/widgets/auth/sign-up/AuthInfo';
import AuthHeader from '@/src/widgets/auth/sign-up/AuthHeader';

import {
  getUserProfile,
  updateUserProfile,
} from '@/src/features/user/api/profile';
import EmailInfo from '@/src/widgets/auth/sign-up/EmailInfo';
import { View } from 'react-native';
import SignUpButton from '@/src/widgets/auth/sign-up/SignUpButton';
import { useRouter } from 'expo-router';
const fetch = async () => {
  try {
    const profile = await getUserProfile();
    const { email, socialAccounts, name, birthDate } = profile.data;
    return {
      email,
      name,
      birthDate,
      provider: socialAccounts[0]?.provider,
    };
  } catch (error) {
    console.log(error);
  }
};
export default function AuthInfoPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState<'google' | 'apple' | null>(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDateValue | null>(null);

  useEffect(() => {
    fetch().then((info) => {
      if (!info) return;
      setEmail(info.email);
      setProvider(info.provider ?? null);
      setName(info.name ?? '');
      setBirthDate(parseBirthDate(info.birthDate));
    });
  }, []);

  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const birthDateText = birthDate ? formatBirthDate(birthDate) : '';
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);

  const isAuthInfoValid = name.trim().length > 0 && birthDate !== null;

  const isVerifyDisabled = !isAuthInfoValid || isSubmittingSignUp;

  const handleSignUpButton = async () => {
    try {
      await updateUserProfile({
        birthDate: birthDate ? formatBirthDate(birthDate) : '',
      });
      setIsSubmittingSignUp(true);
      router.replace('/');
    } catch (error) {
      console.log(error);
      setIsSubmittingSignUp(false);
    } finally {
      setIsSubmittingSignUp(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AuthHeader />
      <EmailInfo provider={provider} email={email} />
      <AuthInfo
        name={name}
        birthDate={birthDateText}
        onNameChange={setName}
        onBirthDateFocus={() => setIsBirthDatePickerOpen(true)}
      />
      <BirthDatePickerBottomSheet
        visible={isBirthDatePickerOpen}
        value={birthDate}
        onChange={setBirthDate}
        onClose={() => setIsBirthDatePickerOpen(false)}
      />
      <SignUpButton onPress={handleSignUpButton} disabled={isVerifyDisabled} />
    </View>
  );
}
