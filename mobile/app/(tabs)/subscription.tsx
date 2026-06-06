import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { getBackendUrl } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function SubscriptionScreen() {
  const { theme } = useTheme();
  const { user, setIsSubscribed } = useUser();
  const [loading, setLoading] = useState(false);
  const urlParams = ExpoLinking.useURL();

  useEffect(() => {
    if (urlParams) {
      const parsed = ExpoLinking.parse(urlParams);
      if (parsed.queryParams?.payment_success === 'true') {
        setIsSubscribed(true);
      }
    }
  }, [urlParams]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const url = `${getBackendUrl()}/api/subscriptions/create-link`;
      const deepLink = ExpoLinking.createURL('/subscription', { queryParams: { payment_success: 'true' } });
      const callbackUrl = `${getBackendUrl()}/api/subscriptions/callback?user_id=${user?.id || 1}&redirect_to=${encodeURIComponent(deepLink)}`;
      
      const response = await axios.post(url, { user_id: user?.id || 1, callback_url: callbackUrl });
      
      if (response.data.success && response.data.short_url) {
        // Open the Razorpay payment link in the browser
        await ExpoLinking.openURL(response.data.short_url);
      }
    } catch (err: any) {
      console.warn("Payment link creation failed:", err);
      Alert.alert("Error", err.response?.data?.error || "Could not generate payment link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/premium_pet.png')} 
              style={styles.heroImage} 
            />
            <Text style={[styles.title, { color: theme.text }]}>Premium Pet Pass</Text>
          </View>
          
          <Text style={[styles.subtitle, { color: theme.text + '99' }]}>
            Unlock the ultimate experience for you and your pets!
          </Text>

          <View style={styles.featuresTitleContainer}>
            <Text style={[styles.featuresTitle, { color: theme.text }]}>Premium Benefits:</Text>
          </View>

          <View style={styles.features}>
            <FeatureItem text="Access all exclusive events" theme={theme} />
            <FeatureItem text="Unlimited service bookings" theme={theme} />
            <FeatureItem text="Priority customer support" theme={theme} />
            <FeatureItem text="Exclusive 10% member discounts" theme={theme} />
            <FeatureItem text="Ad-free native app experience" theme={theme} />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.text + '20' }]} />

          {user?.isSubscribed ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#4cd964" />
              <Text style={[styles.successText, { color: theme.text }]}>You are a Premium Member!</Text>
              <Text style={[styles.successSubtext, { color: theme.text + '99' }]}>Your subscription is active and all features are unlocked.</Text>
            </View>
          ) : (
              <View style={styles.actionContainer}>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceTag, { color: theme.text }]}>₹499</Text>
                  <Text style={[styles.priceCycle, { color: theme.text + '99' }]}>/ month</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.subscribeButton, { backgroundColor: theme.primary }]}
                  onPress={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.subscribeText}>Upgrade Now</Text>
                  )}
                </TouchableOpacity>
                <Text style={[styles.guaranteeText, { color: theme.text + '80' }]}>Cancel anytime. Secure automated payment via Razorpay.</Text>
              </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ text, theme }: { text: string, theme: any }) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
        <Ionicons name="checkmark" size={12} color="#FFF" />
      </View>
      <Text style={[styles.featureText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FF8C00',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresTitleContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
  successSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  actionContainer: {
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceTag: {
    fontSize: 36,
    fontWeight: '900',
  },
  priceCycle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  guaranteeText: {
    fontSize: 13,
    textAlign: 'center',
  }
});
