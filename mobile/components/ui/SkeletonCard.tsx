import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function SkeletonCard() {
  const { theme } = useTheme();
  const animatedOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();

    return () => animation.stop();
  }, [animatedOpacity]);

  const animatedStyle = {
    opacity: animatedOpacity,
    backgroundColor: theme.text,
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <Animated.View style={[styles.skeletonBlock, styles.title, animatedStyle]} />
        <Animated.View style={[styles.skeletonBlock, styles.price, animatedStyle]} />
      </View>
      
      <View style={styles.badgeContainer}>
        <Animated.View style={[styles.skeletonBlock, styles.badge, animatedStyle]} />
      </View>

      <Animated.View style={[styles.skeletonBlock, styles.descriptionLine, { width: '100%' }, animatedStyle]} />
      <Animated.View style={[styles.skeletonBlock, styles.descriptionLine, { width: '85%' }, animatedStyle]} />
      <Animated.View style={[styles.skeletonBlock, styles.descriptionLine, { width: '60%', marginBottom: 12 }, animatedStyle]} />
      
      <Animated.View style={[styles.skeletonBlock, styles.provider, animatedStyle]} />
      
      <Animated.View style={[styles.skeletonBlock, styles.bookButton, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  skeletonBlock: {
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    height: 22,
    width: '60%',
    borderRadius: 6,
  },
  price: {
    height: 22,
    width: '20%',
    borderRadius: 6,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  badge: {
    height: 24,
    width: 70,
    borderRadius: 12,
  },
  descriptionLine: {
    height: 14,
    marginBottom: 8,
  },
  provider: {
    height: 14,
    width: '40%',
    marginBottom: 16,
  },
  bookButton: {
    height: 44,
    width: '100%',
    borderRadius: 8,
  }
});
