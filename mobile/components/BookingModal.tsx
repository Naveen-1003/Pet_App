import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import { getBackendUrl } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

interface BookingModalProps {
  visible: boolean;
  offering: any;
  onClose: () => void;
}

export default function BookingModal({ visible, offering, onClose }: BookingModalProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  if (!offering) return null;

  const handleProceed = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: 1, // hardcoded for demo
        offering_id: offering.id,
        discount_code: discountCode.trim()
      };
      const response = await axios.post(`${getBackendUrl()}/api/bookings/initiate`, payload);
      const paymentUrl = response.data.provider_payment_url;
      
      if (paymentUrl) {
        await Linking.openURL(paymentUrl);
        // Reset states and close
        setDiscountCode('');
        onClose();
      } else {
         setError("No payment URL returned.");
      }
    } catch (err: any) {
      console.warn("Booking submit failed:", err);
      setError(err.response?.data?.error || "Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setDiscountCode('');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Book {offering.type === 'event' ? 'Event' : 'Service'}</Text>
          <Text style={[styles.offeringTitle, { color: theme.text }]}>{offering.title}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>Base Price: ${offering.base_price}</Text>

          <View style={styles.inputContainer}>
             <Text style={[styles.label, { color: theme.text }]}>Discount Code (Optional):</Text>
             <TextInput
               style={[styles.input, { color: theme.text, borderColor: theme.text + '33' }]}
               placeholder="e.g. SAVE20"
               placeholderTextColor={theme.text + '80'}
               value={discountCode}
               onChangeText={setDiscountCode}
               autoCapitalize="characters"
             />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal} disabled={loading}>
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.proceedButton, { backgroundColor: theme.primary }]} 
              onPress={handleProceed}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.proceedText}>Proceed to Payment</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  offeringTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  cancelButton: {
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    padding: 14,
    borderRadius: 12,
    flex: 2,
    alignItems: 'center',
  },
  proceedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
