import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/theme';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const { login } = useUser();
  const router = useRouter();
  const { themeType } = useTheme();

  // Safely get theme colors with a fallback
  const theme = colors[themeType as keyof typeof colors] || colors.light;

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name to continue.');
      return;
    }
    
    // Set mock user 
    login(name.trim());
    
    // Replace current screen with tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.primary }]}>🐾 Vibe Pets</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Your pet's best life, all in one place.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.primary,
              },
            ]}
            placeholder="What is your name?"
            placeholderTextColor={themeType === 'dark' ? '#888' : '#aaa'}
            value={name}
            onChangeText={setName}
            autoCorrect={false}
            maxLength={50}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
