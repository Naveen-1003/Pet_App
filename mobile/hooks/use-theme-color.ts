import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof colors.light & keyof typeof colors.dark
) {
  const { themeType, theme } = useTheme();
  const colorFromProps = props[themeType];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorName];
  }
}
