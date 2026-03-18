import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme, themeType, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.background },
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <MaterialCommunityIcons
              name={themeType === 'light' ? 'dog' : 'cat'}
              size={24}
              color={theme.text}
            />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}