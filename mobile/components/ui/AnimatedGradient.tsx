import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedGradientProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedGradient({ children, style }: AnimatedGradientProps) {
  const { theme } = useTheme();
  
  // Shared value to animate the gradient positioning
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.linear) }),
      -1, // infinite
      true // reverse loop (ping-pong)
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      start: { x: progress.value * 0.5, y: progress.value * 0.5 },
      end: { x: 1 - progress.value * 0.5, y: 1 - progress.value * 0.5 },
    };
  });

  return (
    <AnimatedLinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      animatedProps={animatedProps}
      style={[styles.container, style]}
    >
      {children}
    </AnimatedLinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
