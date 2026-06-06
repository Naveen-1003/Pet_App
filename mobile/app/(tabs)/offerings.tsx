import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, ScrollView, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getBackendUrl } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import BookingModal from '../../components/BookingModal';
import SubscriptionModal from '../../components/SubscriptionModal';
import { useUser } from '../../context/UserContext';
import SkeletonCard from '../../components/ui/SkeletonCard';

interface Offering {
  id: number;
  title: string;
  description: string;
  type: 'event' | 'service';
  provider_name: string;
  base_price: string;
  provider_payment_url: string;
  is_premium_only: boolean;
}

const getContextImage = (item: Offering) => {
  const text = (item.title + ' ' + item.description).toLowerCase();
  
  if (text.includes('groom') || text.includes('bath') || text.includes('wash')) {
    return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80'; // Dog bath
  }
  if (text.includes('health') || text.includes('vet') || text.includes('medical') || text.includes('expo')) {
    return 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80'; // Vet
  }
  if (text.includes('board') || text.includes('overnight') || text.includes('sleep') || text.includes('stay')) {
    return 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80'; // Sleeping dog
  }
  if (text.includes('train') || text.includes('puppy') || text.includes('basic') || text.includes('obedienc')) {
    return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'; // Obedient dog
  }
  if (text.includes('walk') || text.includes('park') || text.includes('meetup')) {
    return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80'; // Dog park
  }
  
  // Defaults based on type
  if (item.type === 'event') {
    return 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80'; // Dogs playing
  }
  return 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&q=80'; // Happy dog
};

const FallbackImage = ({ uri, style }: { uri: string, style: any }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !uri) {
    // Fallback to our local hero image if the network image fails
    return <Image source={require('../../assets/images/login_hero.png')} style={style} />;
  }
  
  return (
    <Image 
      source={{ uri }} 
      style={style} 
      onError={() => setHasError(true)}
    />
  );
};

export default function OfferingsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  
  const { theme } = useTheme();
  const { user } = useUser();

  const { data: offerings = [], isLoading: loading, isError, error: queryError, refetch } = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      const response = await axios.get(`${getBackendUrl()}/api/offerings`);
      return response.data;
    }
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item }: { item: Offering }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <FallbackImage 
        uri={getContextImage(item)} 
        style={styles.bannerImage} 
      />
      <View style={styles.textContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            {parseFloat(item.base_price) === 0 ? 'Free' : `₹${item.base_price}`}
          </Text>
        </View>
        
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: theme.primary + '33' }]}> 
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          {Boolean(item.is_premium_only) && (
            <View style={[styles.badge, { backgroundColor: '#FFD70033', marginLeft: 8 }]}> 
              <Text style={[styles.badgeText, { color: '#FFD700' }]}>
                ★ PREMIUM
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.description, { color: theme.text + '99' }]}>{item.description}</Text>
        <Text style={[styles.provider, { color: theme.text + 'B3' }]}>By: {item.provider_name}</Text>
        
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            if (item.is_premium_only && !user?.isSubscribed) {
              setSubscriptionModalVisible(true);
            } else {
              setSelectedOffering(item);
              setModalVisible(true);
            }
          }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Oops! Something went wrong.</Text>
        <Text style={[styles.errorSubtext, { color: theme.text }]}>
          {queryError instanceof Error ? queryError.message : "Network Error: Could not reach the server."}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.primary }]} 
          onPress={() => refetch()}
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
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  textContent: {
    padding: 16,
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
