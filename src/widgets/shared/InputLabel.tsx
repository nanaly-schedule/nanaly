import { spacingSpaicng14, typoColorPrimary } from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface InputLabelProps {
  label: string;
}

export default function InputLabel({ label }: InputLabelProps) {
  return (
    <NText
      variant="sb14"
      style={{ color: typoColorPrimary, marginBottom: spacingSpaicng14 }}
    >
      {label}
    </NText>
  );
}
