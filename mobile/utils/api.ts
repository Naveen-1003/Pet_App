import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getBackendUrl() {
    let localIp = 'localhost';
    const hostUri = Constants.expoConfig?.hostUri;
    
    if (hostUri) {
        localIp = hostUri.split(':')[0];
    }
    
    let backendUrl = `http://${localIp}:3000`;
    
    if (Platform.OS === 'web') {
        backendUrl = 'http://localhost:3000';
    } else if (Platform.OS === 'android' && !hostUri) {
        // Fallback for Android emulator when not using Expo Go over Wifi
        backendUrl = 'http://10.0.2.2:3000';
    }
    
    return backendUrl;
}
