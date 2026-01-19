import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import Fonts2 from '../Fonts2';
import Fonts from '../Fonts';
import { CartContext } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale } from 'react-native-size-matters';

const PaymentBilling = () => {
  const navigation = useNavigation();
  const { cartItems, offer_price } = useContext(CartContext);

  // Payment state
  const [selectedPayment, setSelectedPayment] = useState(1); // 1: COD, 2: UPI, 3: Debit, 4: Credit
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedUPI, setSelectedUPI] = useState(null);
  const [opacity, setOpacity] = useState(1);

  // Saved cards state
  const [savedDebitCards, setSavedDebitCards] = useState([]);
  const [savedCreditCards, setSavedCreditCards] = useState([]);
  const [selectedDebitCard, setSelectedDebitCard] = useState(null);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);

  // Modal state
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardType, setCardType] = useState('debit'); // 'debit' or 'credit'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Animations
  const translateX = useSharedValue(0);
  const upiAnimation = useSharedValue(0);
  const debitAnimation = useSharedValue(0);
  const creditAnimation = useSharedValue(0);
  const isPaymentValidShared = useSharedValue(1); // 1 = valid (COD default), 0 = invalid

  // Calculate totals
  let subTotal = cartItems.reduce(
    (total, item) =>
      total + parseInt(item.prices.replace('₹', '')) * item.Quantiy,
    0,
  );
  let Taxes = Math.round(subTotal * 0.05);
  let Delivery = 10;
  let Total = Taxes + Delivery + subTotal - offer_price;

  // Load saved cards on mount
  useEffect(() => {
    loadSavedCards();
  }, []);

  const loadSavedCards = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const parsed = JSON.parse(userData);
        setSavedDebitCards(parsed.debitCards || []);
        setSavedCreditCards(parsed.creditCards || []);
      }
    } catch (error) {
      console.log('Error loading cards:', error);
    }
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
        setSavedDebitCards(updatedCards);
        setSelectedDebitCard(newCard);
      } else {
        const updatedCards = [...(parsed.creditCards || []), newCard];
        parsed.creditCards = updatedCards;
        setSavedCreditCards(updatedCards);
        setSelectedCreditCard(newCard);
      }

      await AsyncStorage.setItem('User', JSON.stringify(parsed));
      setCardModalVisible(false);
      resetCardForm();
      Alert.alert('Success', 'Card saved successfully!');
    } catch (error) {
      console.log('Error saving card:', error);
      Alert.alert('Error', 'Failed to save card');
    }
  };

  const resetCardForm = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        translateX.value = 0;
      };
    }, []),
  );

  // Handle section expansion
  const toggleSection = section => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      setSelectedPayment(section);
    }
  };

  // Animate sections
  useEffect(() => {
    upiAnimation.value = withTiming(expandedSection === 2 ? 1 : 0, {
      duration: 300,
    });
    debitAnimation.value = withTiming(expandedSection === 3 ? 1 : 0, {
      duration: 300,
    });
    creditAnimation.value = withTiming(expandedSection === 4 ? 1 : 0, {
      duration: 300,
    });
  }, [expandedSection, savedDebitCards.length, savedCreditCards.length]);

  const upiStyle = useAnimatedStyle(() => ({
    height: interpolate(upiAnimation.value, [0, 1], [70, 190]),
  }));

  // Calculate dynamic height based on saved cards
  // Base height for header: 70, Card row: 80, Add button: 60, Padding: 25
  const debitExpandedHeight = savedDebitCards.length === 0 ? 155 : 235;
  const creditExpandedHeight = savedCreditCards.length === 0 ? 155 : 235;

  const debitStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        debitAnimation.value,
        [0, 1],
        [70, debitExpandedHeight],
      ),
    }),
    [debitExpandedHeight],
  );

  const creditStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        creditAnimation.value,
        [0, 1],
        [70, creditExpandedHeight],
      ),
    }),
    [creditExpandedHeight],
  );

  // Check if a valid payment method is selected and update shared value
  useEffect(() => {
    let valid = false;
    if (selectedPayment === 1) {
      // Cash on Delivery - always valid
      valid = true;
    } else if (selectedPayment === 2 && selectedUPI) {
      // UPI - needs a UPI app selected
      valid = true;
    } else if (selectedPayment === 3 && selectedDebitCard) {
      // Debit Card - needs a card selected
      valid = true;
    } else if (selectedPayment === 4 && selectedCreditCard) {
      // Credit Card - needs a card selected
      valid = true;
    }
    isPaymentValidShared.value = valid ? 1 : 0;
  }, [selectedPayment, selectedUPI, selectedDebitCard, selectedCreditCard]);

  const showPaymentAlert = () => {
    Alert.alert(
      'Select Payment Method',
      'Please select a valid payment method before proceeding.',
      [{ text: 'OK' }],
    );
  };

  // Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      // Only allow swipe if payment is valid
      if (isPaymentValidShared.value === 0) {
        return;
      }
      const maxTranslation = 270;
      translateX.value = Math.min(
        Math.max(0, event.translationX),
        maxTranslation,
      );
      runOnJS(setOpacity)(1 - translateX.value / 270);
    })
    .onEnd(() => {
      if (isPaymentValidShared.value === 0) {
        runOnJS(showPaymentAlert)();
        return;
      }
      if (translateX.value > 250) {
        runOnJS(navigation.replace)('orderd');
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        runOnJS(setOpacity)(1);
      }
    });

  const animatedSwipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const navigate = () => {
    navigation.goBack();
  };

  const renderSavedCard = (card, isSelected, onSelect) => (
    <TouchableOpacity
      key={card.id}
      style={[styles.savedCard, isSelected && styles.savedCardSelected]}
      onPress={() => onSelect(card)}
    >
      <View style={styles.cardIconContainer}>
        <Image
          source={require('./Images/credit-card(1).png')}
          style={styles.cardIcon}
        />
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardNumberText}>
          •••• •••• •••• {card.lastFour}
        </Text>
        <Text style={styles.cardHolderText}>{card.cardHolder}</Text>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAddCardButton = type => (
    <TouchableOpacity
      style={styles.addCardButton}
      onPress={() => {
        setCardType(type);
        setCardModalVisible(true);
      }}
    >
      <Text style={styles.addCardIcon}>+</Text>
      <Text style={styles.addCardText}>
        Add New {type === 'debit' ? 'Debit' : 'Credit'} Card
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={navigate}>
            <Image
              style={styles.backIcon}
              source={require('./Images/icons8-back-100.png')}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes (5% GST)</Text>
            <Text style={styles.summaryValue}>₹{Taxes}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>₹{Delivery}</Text>
          </View>
          {offer_price > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#02B334' }]}>
                -₹{offer_price}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{Total}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Pay on Delivery */}
          <TouchableOpacity
            onPress={() => {
              setSelectedPayment(1);
              setExpandedSection(null);
            }}
          >
            <View
              style={[
                styles.paymentOption,
                selectedPayment === 1 && styles.paymentOptionSelected,
              ]}
            >
              <View style={styles.paymentIconContainer}>
                <Image
                  style={styles.paymentIcon}
                  source={require('./Images/money_14341827.png')}
                />
              </View>
              <Text
                style={[
                  styles.paymentText,
                  selectedPayment === 1 && styles.paymentTextSelected,
                ]}
              >
                Pay on Delivery
              </Text>
              {selectedPayment === 1 && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* UPI Apps */}
          <TouchableOpacity
            onPress={() => toggleSection(2)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[styles.paymentOption, styles.expandableOption, upiStyle]}
            >
              <View style={styles.paymentHeader}>
                <View style={styles.paymentIconContainer}>
                  <Image
                    style={styles.paymentIcon}
                    source={require('./Images/icons8-bhim-100.png')}
                  />
                </View>
                <Text style={styles.paymentText}>UPI Apps</Text>
                <Text
                  style={[
                    styles.arrow,
                    expandedSection === 2 && styles.arrowRotated,
                  ]}
                >
                  ▶
                </Text>
              </View>

              {expandedSection === 2 && (
                <View style={styles.upiContainer}>
                  <TouchableOpacity
                    style={[
                      styles.upiOption,
                      selectedUPI === 1 && styles.upiOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedUPI(1);
                      setSelectedPayment(2);
                    }}
                  >
                    <Image
                      source={require('./Images/icons8-google-pay-100.png')}
                      style={styles.upiIcon}
                    />
                    <Text style={styles.upiText}>Google Pay</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.upiOption,
                      selectedUPI === 2 && styles.upiOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedUPI(2);
                      setSelectedPayment(2);
                    }}
                  >
                    <Image
                      source={require('./Images/cropped_image.png')}
                      style={styles.upiIcon}
                    />
                    <Text style={styles.upiText}>PhonePe</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.upiOption,
                      selectedUPI === 3 && styles.upiOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedUPI(3);
                      setSelectedPayment(2);
                    }}
                  >
                    <Image
                      source={require('./Images/icons8-paytm-100.png')}
                      style={styles.upiIcon}
                    />
                    <Text style={styles.upiText}>Paytm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Debit Card */}
          <TouchableOpacity
            onPress={() => toggleSection(3)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.paymentOption,
                styles.expandableOption,
                debitStyle,
              ]}
            >
              <View style={styles.paymentHeader}>
                <View style={styles.paymentIconContainer}>
                  <Image
                    style={styles.paymentIcon}
                    source={require('./Images/credit-card(1).png')}
                  />
                </View>
                <Text style={styles.paymentText}>Debit Card</Text>
                <Text
                  style={[
                    styles.arrow,
                    expandedSection === 3 && styles.arrowRotated,
                  ]}
                >
                  ▶
                </Text>
              </View>

              {expandedSection === 3 && (
                <View style={styles.cardContainer}>
                  {savedDebitCards.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {savedDebitCards.map(card =>
                        renderSavedCard(
                          card,
                          selectedDebitCard?.id === card.id,
                          c => {
                            setSelectedDebitCard(c);
                            setSelectedPayment(3);
                          },
                        ),
                      )}
                    </ScrollView>
                  ) : null}
                  {renderAddCardButton('debit')}
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Credit Card */}
          <TouchableOpacity
            onPress={() => toggleSection(4)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.paymentOption,
                styles.expandableOption,
                creditStyle,
              ]}
            >
              <View style={styles.paymentHeader}>
                <View style={styles.paymentIconContainer}>
                  <Image
                    style={styles.paymentIcon}
                    source={require('./Images/credit-card(1).png')}
                  />
                </View>
                <Text style={styles.paymentText}>Credit Card</Text>
                <Text
                  style={[
                    styles.arrow,
                    expandedSection === 4 && styles.arrowRotated,
                  ]}
                >
                  ▶
                </Text>
              </View>

              {expandedSection === 4 && (
                <View style={styles.cardContainer}>
                  {savedCreditCards.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {savedCreditCards.map(card =>
                        renderSavedCard(
                          card,
                          selectedCreditCard?.id === card.id,
                          c => {
                            setSelectedCreditCard(c);
                            setSelectedPayment(4);
                          },
                        ),
                      )}
                    </ScrollView>
                  ) : null}
                  {renderAddCardButton('credit')}
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          <View style={{ height: 150 }} />
        </ScrollView>

        {/* Bottom Slider */}
        <View style={styles.bottomContainer}>
          <View style={styles.sliderContainer}>
            <GestureDetector gesture={panGesture}>
              <View style={styles.sliderTrack}>
                <Text style={[styles.slideText, { opacity: opacity }]}>
                  Slide to Pay ₹{Total}
                </Text>
                <Animated.View style={[styles.sliderThumb, animatedSwipeStyle]}>
                  <FastImage
                    style={styles.sliderIcon}
                    source={require('./Images/vRWxkaIIJF-ezgif.com-crop.gif')}
                  />
                </Animated.View>
              </View>
            </GestureDetector>
          </View>
        </View>

        {/* Add Card Modal */}
        <Modal
          visible={cardModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCardModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setCardModalVisible(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Add {cardType === 'debit' ? 'Debit' : 'Credit'} Card
                </Text>
                <TouchableOpacity onPress={() => setCardModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm}>
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

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
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
                  <View style={styles.inputHalf}>
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
                  <Text style={styles.saveButtonText}>Save Card</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default PaymentBilling;

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
  backIcon: {
    height: 20,
    width: 20,
  },
  headerTitle: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  orderSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  summaryValue: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#FF6B00',
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  paymentOption: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  paymentOptionSelected: {
    backgroundColor: '#02B334',
  },
  expandableOption: {
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },
  paymentIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  paymentText: {
    flex: 1,
    fontSize: scale(16),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
    marginLeft: 14,
  },
  paymentTextSelected: {
    color: '#fff',
  },
  arrow: {
    fontSize: 14,
    color: '#999',
  },
  arrowRotated: {
    transform: [{ rotate: '90deg' }],
  },
  selectedBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#02B334',
    fontWeight: 'bold',
    fontSize: 16,
  },
  upiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 10,
  },
  upiOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  upiOptionSelected: {
    borderColor: '#02B334',
    backgroundColor: '#f0fff4',
  },
  upiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  upiText: {
    fontSize: scale(11),
    fontFamily: Fonts2.MEDUIM,
    marginTop: 6,
    color: '#1a1a1a',
  },
  cardContainer: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 200,
  },
  savedCardSelected: {
    borderColor: '#02B334',
    backgroundColor: '#f0fff4',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cardDetails: {
    marginLeft: 12,
  },
  cardNumberText: {
    fontSize: scale(14),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  cardHolderText: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#02B334',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F0',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addCardIcon: {
    fontSize: 20,
    color: '#FF6B00',
    marginRight: 8,
  },
  addCardText: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#FF6B00',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sliderContainer: {
    width: '100%',
  },
  sliderTrack: {
    height: 60,
    backgroundColor: '#FFE8DF',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  slideText: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: scale(16),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  sliderThumb: {
    width: 50,
    height: 44,
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderIcon: {
    width: 30,
    height: 30,
    transform: [{ rotate: '270deg' }],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  modalClose: {
    fontSize: 22,
    color: '#666',
  },
  modalForm: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontSize: scale(16),
    fontFamily: Fonts2.MEDUIM,
    color: '#1a1a1a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputHalf: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
});
