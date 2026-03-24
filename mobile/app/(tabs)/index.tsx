import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../constants/theme';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { themeType } = useTheme();

  const theme = colors[themeType as keyof typeof colors] || colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.primary }]}>
            Hello, {user?.name || 'Pet Lover'}!
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Welcome to your Vibe Pets dashboard.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          {user?.isSubscribed ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>✨ Premium Member ✨</Text>
            </View>
          ) : (
            <View style={styles.upsellContainer}>
              <Text style={[styles.upsellText, { color: theme.text }]}>
                Unlock all features with a Premium Pass
              </Text>
              <TouchableOpacity
                style={[styles.subscribeButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/subscription')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Get Premium</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.mainAction, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/offerings')}
          activeOpacity={0.8}
        >
          <Text style={styles.mainActionText}>Discover Events & Services</Text>
        </TouchableOpacity>
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 32,
  },
  premiumBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  premiumText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F5A623', 
  },
  upsellContainer: {
    alignItems: 'center',
  },
  upsellText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  subscribeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  mainAction: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  mainActionText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});