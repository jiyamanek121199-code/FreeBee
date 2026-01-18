import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Modal,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Fonts2 from '../Fonts2';
import { CartContext } from './CartContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { scale, verticalScale } from 'react-native-size-matters';
const { width } = Dimensions.get('window');
const Modall = ({ modalVisible, setModalVisible, subTotal = 0 }) => {
  const [couponCode, setCouponCode] = useState('');
  const [another_modal, setAnother_modal] = useState(false);
  const [appliedCouponName, setAppliedCouponName] = useState('');
  const { SetOffer_price, offer_price } = useContext(CartContext);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnother_modal(false);
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, [another_modal]);

  const coupons = [
    {
      id: 1,
      name: 'JUMBO30',
      title: 'Jumbo Savings',
      discount: '30%',
      maxDiscount: 100,
      minOrder: 250,
      description: 'Get 30% off up to ₹100',
      validTill: 'Valid till Jan 31, 2026',
    },
    {
      id: 2,
      name: 'FREEBEE50',
      title: 'FreeBee Special',
      discount: '50%',
      maxDiscount: 150,
      minOrder: 400,
      description: 'Get 50% off up to ₹150',
      validTill: 'Valid till Feb 15, 2026',
    },
    {
      id: 3,
      name: 'WELCOME20',
      title: 'Welcome Offer',
      discount: '20%',
      maxDiscount: 50,
      minOrder: 100,
      description: 'Get 20% off up to ₹50',
      validTill: 'Valid till Mar 01, 2026',
    },
    {
      id: 4,
      name: 'FLAT75',
      title: 'Flat Discount',
      discount: '₹75',
      maxDiscount: 75,
      minOrder: 300,
      description: 'Flat ₹75 off on orders above ₹300',
      validTill: 'Valid till Feb 28, 2026',
    },
    {
      id: 5,
      name: 'TASTY40',
      title: 'Tasty Tuesday',
      discount: '40%',
      maxDiscount: 120,
      minOrder: 350,
      description: 'Get 40% off up to ₹120',
      validTill: 'Valid till Jan 25, 2026',
    },
  ];

  // Filter coupons based on search input
  const filteredCoupons = useMemo(() => {
    if (!couponCode.trim()) {
      return coupons;
    }
    const searchTerm = couponCode.toLowerCase().trim();
    return coupons.filter(
      coupon =>
        coupon.name.toLowerCase().includes(searchTerm) ||
        coupon.title.toLowerCase().includes(searchTerm) ||
        coupon.description.toLowerCase().includes(searchTerm),
    );
  }, [couponCode, coupons]);

  const handleApplyCoupon = coupon => {
    if (subTotal < coupon.minOrder) {
      Alert.alert(
        'Minimum Order Required',
        `Add items worth ₹${coupon.minOrder} or more to apply this coupon.`,
        [{ text: 'OK', style: 'default' }],
      );
    } else {
      SetOffer_price(coupon.maxDiscount);
      setAppliedCouponName(coupon.name);
      setAnother_modal(true);
    }
  };

  const handleSearchApply = () => {
    if (!couponCode.trim()) {
      Alert.alert('Enter Code', 'Please enter a coupon code');
      return;
    }

    const foundCoupon = coupons.find(
      c => c.name.toUpperCase() === couponCode.toUpperCase().trim(),
    );

    if (foundCoupon) {
      handleApplyCoupon(foundCoupon);
      setCouponCode('');
    } else {
      Alert.alert(
        'Invalid Coupon',
        'This coupon code is not valid. Please check and try again.',
        [{ text: 'OK' }],
      );
    }
  };

  const handleRemoveCoupon = () => {
    SetOffer_price(0);
    setAppliedCouponName('');
  };

  const renderCouponCard = coupon => {
    const isEligible = subTotal >= coupon.minOrder;
    const isApplied =
      offer_price === coupon.maxDiscount && appliedCouponName === coupon.name;

    return (
      <View key={coupon.id} style={styles.couponCard}>
        {/* Left Discount Section */}
        <View style={styles.couponLeftSection}>
          <Text style={styles.discountNumber}>{coupon.discount}</Text>
          <Text style={styles.offText}>OFF</Text>
        </View>

        {/* Dotted Line with Cutouts */}
        <View style={styles.dottedLineContainer}>
          <View style={styles.topCutout} />
          <View style={styles.dottedLine} />
          <View style={styles.bottomCutout} />
        </View>

        {/* Right Content Section */}
        <View style={styles.couponRightSection}>
          <View style={styles.couponHeader}>
            <View style={styles.couponTitleContainer}>
              <Text style={styles.couponTitle}>{coupon.title}</Text>
              <View style={styles.couponCodeBadge}>
                <Text style={styles.couponCodeText}>{coupon.name}</Text>
              </View>
            </View>
            {isApplied ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveCoupon}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  !isEligible && styles.applyButtonDisabled,
                ]}
                onPress={() => handleApplyCoupon(coupon)}
              >
                <Text
                  style={[
                    styles.applyButtonText,
                    !isEligible && styles.applyButtonTextDisabled,
                  ]}
                >
                  {isEligible ? 'Apply' : 'Locked'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.couponDescription}>{coupon.description}</Text>

          {!isEligible ? (
            <View style={styles.eligibilityContainer}>
              <Icon name="lock" size={14} color="#FF6B00" />
              <Text style={styles.eligibilityText}>
                Add ₹{coupon.minOrder - subTotal} more to unlock
              </Text>
            </View>
          ) : isApplied ? (
            <View style={styles.appliedContainer}>
              <Icon name="check-circle" size={14} color="#02B334" />
              <Text style={styles.appliedText}>Coupon Applied!</Text>
            </View>
          ) : (
            <View style={styles.eligibilityContainer}>
              <Icon name="check-circle-outline" size={14} color="#02B334" />
              <Text style={styles.eligibleText}>Eligible for this offer</Text>
            </View>
          )}

          <View style={styles.validityContainer}>
            <Icon name="clock-outline" size={12} color="#999" />
            <Text style={styles.validityText}>{coupon.validTill}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* Main Coupon Modal */}
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
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <Icon name="ticket-percent" size={28} color="#FF6B00" />
                <Text style={styles.modalTitle}>Apply Coupons</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="tag-outline" size={22} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  onChangeText={setCouponCode}
                  value={couponCode}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={handleSearchApply}
                />
                {couponCode.length > 0 && (
                  <TouchableOpacity onPress={() => setCouponCode('')}>
                    <Icon name="close-circle" size={20} color="#ccc" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.searchApplyButton}
                onPress={handleSearchApply}
              >
                <Text style={styles.searchApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Available Coupons Section */}
            <View style={styles.sectionHeader}>
              <Icon name="star-circle" size={20} color="#FF6B00" />
              <Text style={styles.sectionTitle}>Available Coupons</Text>
              <Text style={styles.couponCount}>({filteredCoupons.length})</Text>
            </View>

            <ScrollView
              style={styles.couponsList}
              showsVerticalScrollIndicator={false}
            >
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map(coupon => renderCouponCard(coupon))
              ) : (
                <View style={styles.noCouponsContainer}>
                  <Icon name="ticket-outline" size={48} color="#ccc" />
                  <Text style={styles.noCouponsText}>No coupons found</Text>
                  <Text style={styles.noCouponsSubtext}>
                    Try a different search term
                  </Text>
                </View>
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={another_modal}
        onRequestClose={() => setAnother_modal(false)}
      >
        <View style={styles.successModalOverlay}>
          <Pressable
            style={styles.successModalBackdrop}
            onPress={() => setAnother_modal(false)}
          />
          <View style={styles.successModalContainer}>
            {/* Confetti Animation */}
            <FastImage
              source={require('./Images/UTnGiI38vG.gif')}
              style={styles.confettiGif}
            />

            {/* Success Content */}
            <View style={styles.successIconContainer}>
              <FastImage
                source={require('./Images/icons8-offer.gif')}
                style={styles.successIcon}
              />
            </View>

            <View style={styles.appliedBadge}>
              <Icon name="check-circle" size={16} color="#02B334" />
              <Text style={styles.appliedBadgeText}>
                '{appliedCouponName}' Applied!
              </Text>
            </View>

            <Text style={styles.savingsAmount}>₹{offer_price}</Text>
            <Text style={styles.savingsLabel}>
              You're saving with this coupon
            </Text>

            <View style={styles.successDivider} />

            <Text style={styles.successMessage}>
              Keep looking out for more exciting offers and save more with each
              order!
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setAnother_modal(false)}
            >
              <Text style={styles.successButtonText}>Awesome! 🎉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Modall;

const styles = StyleSheet.create({
  // Main Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  // Header Styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    fontSize: scale(15),
    fontFamily: Fonts2.MEDUIM,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  searchApplyButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchApplyText: {
    fontSize: scale(15),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginLeft: 8,
  },
  couponCount: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginLeft: 6,
  },
  // Coupons List
  couponsList: {
    paddingHorizontal: 20,
  },
  // Coupon Card Styles
  couponCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  couponLeftSection: {
    width: 65,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    paddingVertical: 20,
  },
  discountNumber: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  offText: {
    fontSize: scale(11),
    fontFamily: Fonts2.BOLD,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  dottedLineContainer: {
    width: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  dottedLine: {
    flex: 1,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  topCutout: {
    width: 16,
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FAFAFA',
    marginTop: -1,
  },
  bottomCutout: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: -1,
  },
  couponRightSection: {
    flex: 1,
    padding: 12,
    paddingLeft: 14,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  couponTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  couponTitle: {
    fontSize: scale(15),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  couponCodeBadge: {
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  couponCodeText: {
    fontSize: scale(10),
    fontFamily: Fonts2.BOLD,
    color: '#FF6B00',
  },
  applyButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  applyButtonText: {
    fontSize: scale(12),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  applyButtonTextDisabled: {
    color: '#999',
  },
  removeButton: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: scale(12),
    fontFamily: Fonts2.BOLD,
    color: '#FF4444',
  },
  couponDescription: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginBottom: 6,
    marginTop: 4,
  },
  eligibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eligibilityText: {
    fontSize: scale(11),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#FF6B00',
    marginLeft: 5,
  },
  eligibleText: {
    fontSize: scale(11),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#02B334',
    marginLeft: 5,
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appliedText: {
    fontSize: scale(11),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#02B334',
    marginLeft: 5,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    fontSize: scale(10),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginLeft: 4,
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,237,230,0.95)',
  },
  successModalContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  confettiGif: {
    position: 'absolute',
    height: 300,
    width: 300,
    top: -50,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    height: 50,
    width: 50,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  appliedBadgeText: {
    fontSize: scale(13),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#02B334',
    marginLeft: 6,
  },
  savingsAmount: {
    fontSize: scale(48),
    fontFamily: Fonts2.BLACK,
    color: '#FF6B00',
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginBottom: 20,
  },
  successDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  successMessage: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  successButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // No Coupons Found Styles
  noCouponsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noCouponsText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#666',
    marginTop: 16,
  },
  noCouponsSubtext: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginTop: 6,
  },
});
