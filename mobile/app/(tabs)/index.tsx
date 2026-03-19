import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedGradient } from '../../components/ui/AnimatedGradient';

export default function Index() {
  const { theme } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  return (
    <AnimatedGradient>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Greeting Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hello, {user?.name || 'Pet Lover'}! 👋
            </Text>
            <Text style={[styles.subGreeting, { color: theme.text + 'BA' }]}>
              Ready for another pawsome day?
            </Text>
          </View>

          {/* Subscription Status Card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {user?.isSubscribed ? (
              <View style={styles.premiumBadgeContainer}>
                <Ionicons name="star" size={36} color="#f5a623" style={{ marginBottom: 8 }} />
                <Text style={[styles.premiumText, { color: theme.text }]}>✨ Premium Member ✨</Text>
                <Text style={[styles.premiumSubtext, { color: theme.text + '99' }]}>
                  All VIP features are unlocked for your beloved pets.
                </Text>
              </View>
            ) : (
              <View style={styles.promoContainer}>
                <View style={[styles.promoIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons name="gift-outline" size={32} color={theme.primary} />
                </View>
                <Text style={[styles.promoTitle, { color: theme.text }]}>Upgrade Your Experience</Text>
                <Text style={[styles.promoText, { color: theme.text + '99' }]}>
                  Unlock all features with a Premium Pass
                </Text>
                <TouchableOpacity 
                  style={[styles.promoButton, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/subscription')}
                >
                  <Text style={styles.promoButtonText}>Get Premium</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Action Button */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.text, shadowColor: theme.text }]}
            onPress={() => router.push('/offerings')}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="calendar-outline" size={24} color={theme.background} />
              <Text style={[styles.actionButtonText, { color: theme.background }]}>
                Discover Events & Services
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.illustrationContainer}>
             <Ionicons name="paw" size={120} color={theme.primary + '11'} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subGreeting: {
    fontSize: 18,
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 24,
  },
  premiumBadgeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  premiumText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  premiumSubtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  promoContainer: {
    alignItems: 'center',
  },
  promoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  promoButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  actionButton: {
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
  }
});