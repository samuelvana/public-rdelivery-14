import { Text, StyleSheet } from 'react-native';

import { useThemeColor } from '../../hooks/useThemeColor';

export function OswaldText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'main' ? styles.main : undefined,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'oswald-regular',
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: 'oswald-regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontFamily: 'oswald-regular',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'oswald-regular',
    fontSize: 20,
  },
  main: {
    fontFamily: 'oswald-regular',
    fontSize: 16,
  },
  button: {
    fontFamily: 'oswald-regular',
    fontSize: 14,
    color: "#fff",
  },
  link: {
    fontFamily: 'oswald-regular',
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
