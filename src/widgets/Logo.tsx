import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  color: string;
}

export default function Logo({ color: _color }: LogoProps) {
  return (
    <View style={styles.logo}>
      <Image
        source={require('@/src/shared/assets/logo_splash.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
    tintColor: '#000000',
  },
});
