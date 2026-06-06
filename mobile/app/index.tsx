import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  require('../assets/images/bg_1.png'),
  require('../assets/images/bg_2.png'),
  require('../assets/images/bg_3.png'),
];

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const { login } = useUser();
  const router = useRouter();
  const { themeType } = useTheme();

  const theme = colors[themeType as keyof typeof colors] || colors.light;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name to continue.');
      return;
    }
    
    login(name.trim());
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Background Slideshow */}
      <View style={StyleSheet.absoluteFillObject}>
        {BACKGROUND_IMAGES.map((img, index) => {
          if (index === activeImageIndex) {
            return (
              <Animated.Image
                key={index}
                source={img}
                style={[styles.backgroundImage, { opacity: fadeAnim }]}
                resizeMode="cover"
              />
            );
          }
          return null;
        })}
        {/* Dark overlay for readability */}
        <View style={styles.overlay} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text 
              style={styles.title}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              🐾 Pets Point
            </Text>
            <Text style={styles.subtitle}>
              Your pet's best life, all in one place.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.glassCard}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#333',
                    borderColor: theme.primary,
                  },
                ]}
                placeholder="What is your name?"
                placeholderTextColor="#666"
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
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background behind everything
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Darken image for better text contrast
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginTop: height * 0.15,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 12,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#EEEEEE',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    position: 'absolute',
    top: height * 0.65, // Around 3/4th mark of the screen
    left: 24,
    right: 24,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 2,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
