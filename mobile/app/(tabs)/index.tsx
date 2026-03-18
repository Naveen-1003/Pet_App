import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
// 1. Updated Import: Pull SafeAreaView from the modern context library
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Constants from 'expo-constants';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedGradient } from '../../components/ui/AnimatedGradient';

export default function Index() {
  const [serverStatus, setServerStatus] = useState('Checking server...');
  const { theme } = useTheme();

  useEffect(() => {
    // Dynamically determine the backend URL based on platform
    let localIp = 'localhost';
    const hostUri = Constants.expoConfig?.hostUri;
    
    if (hostUri) {
      localIp = hostUri.split(':')[0];
    }
    
    let backendUrl = `http://${localIp}:3000/api/health`;
    
    if (Platform.OS === 'web') {
      backendUrl = 'http://localhost:3000/api/health';
    } else if (Platform.OS === 'android' && !hostUri) {
      // 10.0.2.2 is the special alias to your host loopback interface in Android emulators
      backendUrl = 'http://10.0.2.2:3000/api/health';
    }

    axios.get(backendUrl)
      .then(response => setServerStatus(response.data.status))
      .catch(error => {
        console.warn("Backend connection error:", error.message);
        setServerStatus('Cannot connect to backend');
      });
  }, []);

  return (
    <AnimatedGradient>
      <SafeAreaView style={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.text, { color: theme.text }]}>Vibe Pet App Setup</Text>
          <Text style={[styles.status, { color: theme.primary }]}>{serverStatus}</Text>
        </View>
      </SafeAreaView>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
});