import React, { useContext, useState, useCallback, useEffect } from 'react';
import { CartContext } from './CartContext';
import Fonts from '../Fonts';
import Fonts2 from '../Fonts2';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { Screen } from 'react-native-screens';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modall from './Modal';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarScreen = () => {
  const translateY = useSharedValue(0);
  const animation = useSharedValue(0);
  const animationn = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [arrow, setArrow] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const { cartItems, addToCart, removeFromCart, offer_price, SetOffer_price } =
    useContext(CartContext);
  let subTotal = cartItems.reduce(
    (total, item) =>
      total + parseInt(item.prices.replace('₹', '')) * item.Quantiy,
    0,
  );
  let Taxes = Math.round(subTotal * 0.05); // 5% GST for food items
  let Delivary = 10; // Fixed delivery charge ₹10
  let Total = Taxes + Delivary + subTotal - offer_price;
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Coupon minimum order requirements
  const couponMinOrders = {
    100: 250, // JUMBO30: ₹100 discount, min ₹250
    150: 400, // FREEBEE50: ₹150 discount, min ₹400
    50: 100, // WELCOME20: ₹50 discount, min ₹100
    75: 300, // FLAT75: ₹75 discount, min ₹300
    120: 350, // TASTY40: ₹120 discount, min ₹350
  };

  // Check for saved address on mount
  useEffect(() => {
    checkAddress();
  }, []);

  const checkAddress = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.addresses && user.addresses.length > 0) {
          setHasAddress(true);
        } else {
          setHasAddress(false);
        }
      }
    } catch (error) {
      console.log('Error checking address:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkAddress(); // Re-check when screen is focused
      return () => {
        animation.value = 0; // Reset when screen is unfocused
      };
    }, []),
  );

  // Remove coupon if subtotal falls below minimum order requirement
  useEffect(() => {
    if (offer_price > 0 && couponMinOrders[offer_price]) {
      const minOrder = couponMinOrders[offer_price];
      if (subTotal < minOrder) {
        SetOffer_price(0);
        Alert.alert(
          'Coupon Removed',
          `The coupon has been removed as your cart total is below ₹${minOrder}.`,
          [{ text: 'OK' }],
        );
      }
    }
  }, [subTotal, offer_price]);

  useEffect(() => {
    if (cartItems.length === 0) {
      SetOffer_price(0);
    }
  }, [cartItems.length]);
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = event.translationY;
      console.log(translateY.value);
      if (translateY.value < 0) {
        animationn.value = withTiming(1, {
          duration: 450,
          easing: Easing.in(Easing.elastic(1.1)),
        });
      } else {
        animationn.value = withTiming(0, { duration: 400 });
      }
    })
    .onEnd(() => {
      translateY.value = 0; // Reset position with animation
    });
  const animatedStylee = useAnimatedStyle(() => {
    const height = interpolate(animationn.value, [1, 0], [480, 60]);
    return {
      height: height,
    };
  });
  const animateddStylee = useAnimatedStyle(() => {
    const rotate = interpolate(animationn.value, [0, 1], [180, 0]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  function navigate2() {
    // Check if user has an address
    if (!hasAddress) {
      Alert.alert(
        'Add Delivery Address',
        'Please add a delivery address before placing your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Address',
            onPress: () => navigation.navigate('Account'),
          },
        ],
      );
      return;
    }

    setIsLoading(true);
    animation.value = withTiming(1, { duration: 800 }, () => {
      runOnJS(setIsLoading)(false);
      runOnJS(navigation.navigate)('Payment'); // Navigate after animation completes
    });
  }
  // Apply animation style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value == 0
          ? withTiming(350, { duration: 400 })
          : withTiming(80, { duration: 400 }),
      backgroundColor: '#fccaa5',
    };
  });

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {item.imageUrl ? (
          <Image
            style={styles.itemImage}
            source={{ uri: item.imageUrl }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={styles.itemImage}
            source={item.image}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          {item.ratingUrl ? (
            <Image
              style={styles.ratingImage}
              source={{ uri: item.ratingUrl }}
              resizeMode="contain"
            />
          ) : (
            <Image style={styles.ratingImage} source={item.rating} />
          )}
        </View>
        <Text style={styles.itemPrice}>{item.prices}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => removeFromCart(item.id)}
        >
          <Icons name="minus" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.quantityTextContainer}>
          <Text style={styles.quantityText}>{item.Quantiy}</Text>
        </View>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => addToCart(item)}
        >
          <Icons name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartIconContainer}>
        <Icons name="cart-outline" size={80} color="#ccc" />
      </View>
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Add some delicious items to get started!
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.browseButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.cartBadgeContainer}>
          {/* <Icons name="cart" size={24} color="#1a1a1a" /> */}
          {/* {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )} */}
        </View>
      </View>

      {/* Delivery Time Banner */}
      {cartItems.length > 0 && (
        <View style={styles.deliveryBanner}>
          <View style={styles.deliveryIconContainer}>
            <FastImage
              style={styles.deliveryGif}
              source={require('./Images/dummy3.gif')}
            />
          </View>
          <View style={styles.deliveryTextContainer}>
            <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
            <Text style={styles.deliveryTime}>20-25 Minutes</Text>
          </View>
          <View style={styles.deliveryBadge}>
            <Icons name="clock-fast" size={18} color="#FF6B00" />
            <Text style={styles.deliveryBadgeText}>Fast</Text>
          </View>
        </View>
      )}

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCartItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cartList}
        />
      )}

      {/* Bottom Sheet */}
      {cartItems.length > 0 && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[animatedStylee, styles.bottomSheet]}>
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <Animated.View style={[animateddStylee, styles.dragHandle]}>
                <Icons name="chevron-up" size={28} color="#999" />
              </Animated.View>
            </View>

            {/* Price Breakdown */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>₹{subTotal}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes (5% GST)</Text>
                <Text style={styles.priceValue}>₹{Taxes}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Charges</Text>
                <Text style={styles.priceValue}>₹{Delivary}</Text>
              </View>
              {offer_price > 0 && (
                <View style={styles.priceRow}>
                  <View style={styles.discountLabelContainer}>
                    <Icons name="tag" size={16} color="#02B334" />
                    <Text style={styles.discountLabel}>Discount Applied</Text>
                  </View>
                  <Text style={styles.discountValue}>-₹{offer_price}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{Total}</Text>
              </View>
            </View>

            {/* Offers Section */}
            <View style={styles.offersSection}>
              <Text style={styles.offersSectionTitle}>Offers & Benefits</Text>
              <TouchableOpacity
                style={styles.couponButton}
                onPress={() => {
                  setModalVisible(true);
                  console.log(modalVisible);
                }}
              >
                <View style={styles.couponLeft}>
                  <Icons name="ticket-percent" size={22} color="#FF6B00" />
                  <Text style={styles.couponText}>Apply Coupons</Text>
                </View>
                {offer_price === 0 ? (
                  <Icons name="chevron-right" size={24} color="#999" />
                ) : (
                  <View style={styles.couponAppliedBadge}>
                    <Icons name="check-circle" size={20} color="#02B334" />
                    <Text style={styles.couponAppliedText}>Applied</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Place Order Button */}
            {isLoading ? (
              <Animated.View style={[styles.loadingButton, animatedStyle]}>
                <ActivityIndicator size="large" color="white" />
              </Animated.View>
            ) : (
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => navigate2()}
                activeOpacity={0.8}
              >
                <Text style={styles.orderButtonText}>Place Order</Text>
                <View style={styles.orderButtonPrice}>
                  <Text style={styles.orderButtonPriceText}>₹{Total}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        </GestureDetector>
      )}
      <Modall
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        subTotal={subTotal}
      />
    </GestureHandlerRootView>
  );
};

export default CarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(15),
    paddingBottom: 10,
    backgroundColor: '#FAFAFA',
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
    marginRight: verticalScale(15),
  },
  cartBadgeContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    fontSize: 11,
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // Delivery Banner Styles
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  deliveryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deliveryGif: {
    height: 60,
    width: 55,
  },
  deliveryTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  deliveryLabel: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  deliveryTime: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginTop: 2,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deliveryBadgeText: {
    fontSize: scale(12),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#FF6B00',
    marginLeft: 4,
  },
  // Cart List Styles
  cartList: {
    paddingHorizontal: 16,
    paddingBottom: 300,
  },
  // Cart Item Styles
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 10,
  },
  itemName: {
    fontSize: scale(15),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 6,
  },
  ratingImage: {
    height: 14,
    width: 70,
    resizeMode: 'contain',
  },
  itemPrice: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#FF6B00',
  },
  // Quantity Controls
  quantityContainer: {
    backgroundColor: '#FF6B00',
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
  },
  quantityBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityTextContainer: {
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // Empty Cart Styles
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: scale(22),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    alignItems: 'center',
  },
  // Price Section Styles
  priceSection: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  priceValue: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  discountLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#02B334',
    marginLeft: 6,
  },
  discountValue: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#02B334',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#FF6B00',
  },
  // Offers Section Styles
  offersSection: {
    marginTop: 16,
  },
  offersSectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F0',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE0CC',
    borderStyle: 'dashed',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponText: {
    fontSize: scale(15),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  couponAppliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponAppliedText: {
    fontSize: scale(13),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#02B334',
    marginLeft: 4,
  },
  // Order Button Styles
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  orderButtonText: {
    fontSize: scale(17),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  orderButtonPrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  orderButtonPriceText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  loadingButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
