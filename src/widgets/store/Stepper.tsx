import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  borderDividerPrimary,
  brandColorPrimary,
  brandColorSecondary,
  spacingSpaicng14,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import CheckIcon from '@/src/shared/assets/CheckIcon';
import NText from '@/src/shared/ui/NText';

interface StepperProps {
  steps: number;
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const stepperArray = Array(steps)
    .fill(0)
    .map((_, idx) => idx + 1);

  return (
    <View style={styles.container}>
      {stepperArray.map((step, idx) => {
        const isCurrentStep = step === currentStep;
        const isPrevStep = step < currentStep;
        const isPrevDivider = currentStep - 1 === step;
        return (
          <Fragment key={step}>
            <View
              style={[
                styles.default,
                isCurrentStep && styles.active,
                isPrevStep && styles.prev,
              ]}
            >
              {isPrevStep ? (
                <CheckIcon size={24} color={brandColorPrimary} />
              ) : (
                <NText
                  variant="m16"
                  style={{
                    color: isCurrentStep ? backgroundColorWhite : typoColorSub1,
                  }}
                >
                  {step}
                </NText>
              )}
            </View>
            {idx < stepperArray.length - 1 && (
              <View
                style={[
                  styles.divider,
                  isPrevStep && styles.prev,
                  isPrevDivider && styles.active,
                ]}
              />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacingSpaicng14,
  },
  default: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: borderDividerPrimary,
  },
  divider: {
    backgroundColor: borderDividerPrimary,
    height: 3,
    flex: 1,
  },
  prev: {
    backgroundColor: brandColorSecondary,
  },
  active: {
    backgroundColor: brandColorPrimary,
  },
});
