import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// 1. Updated Import: Pull SafeAreaView from the modern context library
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

export default function Index() {
  const [serverStatus, setServerStatus] = useState('Checking server...');
  const { theme } = useTheme();

  useEffect(() => {
    // 2. Updated URL: Point directly to your computer's IP address
    // Note: If your Wi-Fi changes, this IP might change. 
    // If testing on an Android Emulator instead of a real phone, use 'http://10.0.2.2:3000/api/health'
    axios.get('http://192.168.31.100:3000/api/health')
      .then(response => setServerStatus(response.data.status))
      .catch(error => {
        console.error("Backend connection error:", error.message);
        setServerStatus('Cannot connect to backend');
      });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.text, { color: theme.text }]}>Vibe Pet App Setup</Text>
        <Text style={[styles.status, { color: theme.primary }]}>{serverStatus}</Text>
      </View>
    </SafeAreaView>
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