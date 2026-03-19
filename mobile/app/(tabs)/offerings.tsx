import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getBackendUrl } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import BookingModal from '../../components/BookingModal';
import SubscriptionModal from '../../components/SubscriptionModal';
import { useUser } from '../../context/UserContext';

interface Offering {
  id: number;
  title: string;
  description: string;
  type: 'event' | 'service';
  provider_name: string;
  base_price: string;
  provider_payment_url: string;
}

export default function OfferingsScreen() {
  const router = useRouter();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  
  const { theme } = useTheme();
  const { user } = useUser();

  const fetchOfferings = async () => {
    try {
      setError(null);
      const url = `${getBackendUrl()}/api/offerings`;
      const response = await axios.get(url);
      setOfferings(response.data);
    } catch (err: any) {
      console.warn("Error fetching offerings:", err.message);
      setError("Network Error: Could not reach the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOfferings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOfferings();
  }, []);

  const renderItem = ({ item }: { item: Offering }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          {parseFloat(item.base_price) === 0 ? 'Free' : `$${item.base_price}`}
        </Text>
      </View>
      
      <View style={styles.badgeContainer}>
        <View style={[styles.badge, { backgroundColor: theme.primary + '33' }]}> 
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.text + '99' }]}>{item.description}</Text>
      <Text style={[styles.provider, { color: theme.text + 'B3' }]}>By: {item.provider_name}</Text>
      
      <TouchableOpacity 
        style={[styles.bookButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          if (user?.isSubscribed) {
            setSelectedOffering(item);
            setModalVisible(true);
          } else {
            setSubscriptionModalVisible(true);
          }
        }}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Finding the best events for your pets...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Oops! Something went wrong.</Text>
        <Text style={[styles.errorSubtext, { color: theme.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.primary }]} 
          onPress={() => { setLoading(true); fetchOfferings(); }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <FlatList
        data={offerings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>No upcoming events or services.</Text>
          </View>
        }
      />
      <BookingModal 
        visible={modalVisible} 
        offering={selectedOffering} 
        onClose={() => setModalVisible(false)} 
      />
      <SubscriptionModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        onSubscribe={() => {
          setSubscriptionModalVisible(false);
          router.push('/subscription');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  provider: {
    fontSize: 13,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  bookButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
