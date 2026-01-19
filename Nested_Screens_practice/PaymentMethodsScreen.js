import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fonts2 from '../Fonts2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale } from 'react-native-size-matters';

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const [debitCards, setDebitCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardType, setCardType] = useState('debit'); // 'debit' or 'credit'

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const user = JSON.parse(userData);
        setDebitCards(user.debitCards || []);
        setCreditCards(user.creditCards || []);
      }
    } catch (error) {
      console.log('Error loading cards:', error);
    }
  };

  const formatCardNumber = text => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = text => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const resetForm = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
  };

  const saveCard = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      cardNumber: cardNumber.replace(/\s/g, ''),
      lastFour: cardNumber.replace(/\s/g, '').slice(-4),
      cardHolder: cardHolder,
      expiryDate: expiryDate,
    };

    try {
      const userData = await AsyncStorage.getItem('User');
      const parsed = userData ? JSON.parse(userData) : {};

      if (cardType === 'debit') {
        const updatedCards = [...(parsed.debitCards || []), newCard];
        parsed.debitCards = updatedCards;
        setDebitCards(updatedCards);
      } else {
        const updatedCards = [...(parsed.creditCards || []), newCard];
        parsed.creditCards = updatedCards;
        setCreditCards(updatedCards);
      }

      await AsyncStorage.setItem('User', JSON.stringify(parsed));
      setModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Card saved successfully!');
    } catch (error) {
      console.log('Error saving card:', error);
      Alert.alert('Error', 'Failed to save card');
    }
  };

  const deleteCard = async (cardId, type) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const userData = await AsyncStorage.getItem('User');
            const parsed = userData ? JSON.parse(userData) : {};

            if (type === 'debit') {
              const updatedCards = (parsed.debitCards || []).filter(
                c => c.id !== cardId,
              );
              parsed.debitCards = updatedCards;
              setDebitCards(updatedCards);
            } else {
              const updatedCards = (parsed.creditCards || []).filter(
                c => c.id !== cardId,
              );
              parsed.creditCards = updatedCards;
              setCreditCards(updatedCards);
            }

            await AsyncStorage.setItem('User', JSON.stringify(parsed));
          } catch (error) {
            console.log('Error deleting card:', error);
          }
        },
      },
    ]);
  };

  const openAddModal = type => {
    setCardType(type);
    resetForm();
    setModalVisible(true);
  };

  const renderCardItem = (card, type) => (
    <View key={card.id} style={styles.cardItem}>
      <View style={styles.cardIconContainer}>
        <Icon
          name={type === 'debit' ? 'credit-card' : 'credit-card-multiple'}
          size={24}
          color="#FF6B00"
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
        <Text style={styles.cardHolderName}>{card.cardHolder}</Text>
        <Text style={styles.cardExpiry}>Expires {card.expiryDate}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteCard(card.id, type)}
      >
        <Icon name="trash-can-outline" size={22} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderSection = (title, cards, type) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon
          name={type === 'debit' ? 'credit-card' : 'credit-card-multiple'}
          size={22}
          color="#FF6B00"
        />
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.cardCount}>({cards.length})</Text>
      </View>

      {cards.length > 0 ? (
        cards.map(card => renderCardItem(card, type))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="credit-card-off-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No {type} cards saved</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addCardButton}
        onPress={() => openAddModal(type)}
      >
        <Icon name="plus" size={20} color="#FF6B00" />
        <Text style={styles.addCardText}>
          Add {type === 'debit' ? 'Debit' : 'Credit'} Card
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Debit Cards', debitCards, 'debit')}
        {renderSection('Credit Cards', creditCards, 'credit')}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Icon
                name={
                  cardType === 'debit' ? 'credit-card' : 'credit-card-multiple'
                }
                size={28}
                color="#FF6B00"
              />
              <Text style={styles.modalTitle}>
                Add {cardType === 'debit' ? 'Debit' : 'Credit'} Card
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={text => setCardNumber(formatCardNumber(text))}
              />

              <Text style={styles.inputLabel}>Card Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="words"
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={5}
                    value={expiryDate}
                    onChangeText={text => setExpiryDate(formatExpiry(text))}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="•••"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
                <Icon name="content-save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Card</Text>
              </TouchableOpacity>

              <View style={styles.secureNote}>
                <Icon name="shield-check" size={18} color="#02B334" />
                <Text style={styles.secureNoteText}>
                  Your card details are securely stored
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(15),
    paddingBottom: 10,
  },
  backButton: {
    height: 44,
    width: 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Section Styles
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginLeft: 10,
    flex: 1,
  },
  cardCount: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
  },
  // Card Item Styles
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardNumber: {
    fontSize: scale(15),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  cardHolderName: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 2,
  },
  cardExpiry: {
    fontSize: scale(11),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginTop: 10,
  },
  // Add Card Button
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    backgroundColor: '#FFF5F0',
  },
  addCardText: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#FF6B00',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    flex: 1,
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: scale(15),
    fontFamily: Fonts2.MEDUIM,
    color: '#1a1a1a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
    marginLeft: 8,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  secureNoteText: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginLeft: 6,
  },
});
