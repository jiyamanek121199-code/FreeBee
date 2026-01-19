import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Fonts from '../Fonts';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CartContext } from './CartContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = verticalScale(280);

const RestaurantDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate cart total for the restaurant
  const restaurantItemsInCart = cartItems.filter(item =>
    item.id.startsWith('restaurant_'),
  );
  const totalQuantity = restaurantItemsInCart.reduce(
    (acc, curr) => acc + curr.Quantiy,
    0,
  );
  const totalPrice = restaurantItemsInCart.reduce((acc, curr) => {
    const priceStr = curr.price.replace('₹', '').replace(',', '');
    return acc + parseInt(priceStr) * curr.Quantiy;
  }, 0);

  // Restaurant data passed from welcomeScreen or default data
  const restaurantData = route.params || {
    image: require('./Images/istockphoto-1457979959-612x612.jpg'),
    name: 'Rajdhani Restaurant',
    rating: '4.2',
    reviews: '945K Reviews',
    distance: '2.5 km',
    cuisine: 'North Indian, South Indian, Chinese',
    deliveryTime: '15-20 mins',
    info: 'Welcome to Rajdhani Restaurant! We serve authentic Indian cuisine with a modern twist. Our chefs use fresh ingredients to create delicious dishes that will delight your taste buds.',
    address: 'City Center, Near Main Market',
  };

  const menuItems = [
    {
      id: 1,
      name: 'Paneer Tikka',
      description:
        'Grilled cottage cheese marinated in yogurt and aromatic spices, served with mint chutney.',
      price: '₹250',
      category: 'Starters',
      isVeg: true,
      image:
        'https://lentillovingfamily.com/wp-content/uploads/2025/08/paneer-tikka-2.jpg',
    },
    {
      id: 2,
      name: 'Butter Chicken',
      description:
        'Classic mild-spicy curry with tender chicken pieces in a silky tomato butter sauce.',
      price: '₹320',
      category: 'Main Course',
      isVeg: false,
      image:
        'https://www.indianhealthyrecipes.com/wp-content/uploads/2023/04/butter-chicken-recipe.jpg',
    },
    {
      id: 3,
      name: 'Dal Makhani',
      description:
        'Creamy black lentils simmered overnight with butter and cream. A house specialty.',
      price: '₹180',
      category: 'Main Course',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT69FeaPjtsF4HJ5FnURAZmRg8MhZTWaW9mRg&s',
    },
    {
      id: 4,
      name: 'Masala Dosa',
      description:
        'Crispy rice and lentil crepe stuffed with tempered potato mash served with sambar.',
      price: '₹120',
      category: 'South Indian',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO8owQcHu1csisSyh9hXKZ1f7eWK2hmbp7ZQ&s',
    },
    {
      id: 5,
      name: 'Chicken Biryani',
      description:
        'Aromatic basmati rice layered with spiced chicken, saffron, and fresh herbs.',
      price: '₹280',
      category: 'Biryani',
      isVeg: false,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUkFl4-e90gihmLEM7TZZ-LTbwkWQ47VaLMQ&s',
    },
    {
      id: 6,
      name: 'Veg Manchurian',
      description:
        'Vegetable dumplings tossed in a tangy soy-garlic sauce with bell peppers.',
      price: '₹200',
      category: 'Chinese',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGb18ykYxTxIiIOGbIiTRaRJs2VsATNmvGkQ&s',
    },
    {
      id: 7,
      name: 'Tandoori Roti',
      description:
        'Traditional whole wheat bread baked to perfection in a clay oven.',
      price: '₹25',
      category: 'Bread',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Ri5LQA_Jp-iZtnB0iZqaDyDEONNudc_77Q&s',
    },
    {
      id: 8,
      name: 'Gulab Jamun',
      description:
        'Warm, deep-fried milk dumplings soaked in cardamom-infused sugar syrup.',
      price: '₹80',
      category: 'Desserts',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3aJrkMZfZWaRkqQu36Y9TBzYlCrkKHvy7mw&s',
    },
    {
      id: 9,
      name: 'Mango Lassi',
      description:
        'Refreshing traditional yogurt-based drink blended with sweet Alphonso mangoes.',
      price: '₹100',
      category: 'Beverage',
      isVeg: true,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSugNuYpGRKKVLB_Djcryit9aIWIXnxR-aNMQ&s',
    },
    {
      id: 10,
      name: 'Veg Thali',
      description:
        'A complete Indian meal with curry, dal, rice, roti, salad, and dessert.',
      price: '₹350',
      category: 'Thali',
      isVeg: true,
      image:
        'https://i.pinimg.com/originals/0f/13/7d/0f137d2a243f7b63e5716ab4c10c3ee3.jpg',
    },
  ];

  const getItemQuantity = itemId => {
    const cartItem = cartItems.find(item => item.id === `restaurant_${itemId}`);
    return cartItem ? cartItem.Quantiy : 0;
  };

  const handleAddToCart = item => {
    const cartItem = {
      ...item,
      id: `restaurant_${item.id}`,
      prices: item.price,
      imageUrl: item.image,
      ratingUrl: 'https://via.placeholder.com/75x15/4CAF50/FFFFFF?text=★★★★☆',
    };
    addToCart(cartItem);
  };

  const handleRemoveFromCart = itemId => {
    removeFromCart(`restaurant_${itemId}`);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  const renderMenuItem = ({ item }) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.menuItemCard}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <View style={styles.vegIndicatorContainer}>
              <View
                style={[
                  styles.vegIndicator,
                  { borderColor: item.isVeg ? '#4CAF50' : '#E53935' },
                ]}
              >
                <View
                  style={[
                    styles.vegDot,
                    { backgroundColor: item.isVeg ? '#4CAF50' : '#E53935' },
                  ]}
                />
              </View>
              {quantity > 0 && (
                <View style={styles.bestsellerBadge}>
                  <Text style={styles.bestsellerText}>POPULAR</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>{item.price}</Text>
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View style={styles.menuItemImageContainer}>
            <Image
              style={styles.menuItemImage}
              source={{ uri: item.image }}
              resizeMode="cover"
            />

            <View style={styles.addBtnContainer}>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddToCart(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>ADD</Text>
                  <Icon
                    name="plus"
                    size={14}
                    color="#FF6B00"
                    style={styles.addIcon}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleRemoveFromCart(item.id)}
                  >
                    <Icon name="minus" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Icon name="plus" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Animated Fixed Header */}
      <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
        <View style={styles.fixedHeaderContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconCircle}
          >
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.fixedHeaderTitle} numberOfLines={1}>
            {restaurantData.name}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconCircle}>
              <Icon name="share-variant" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Transparent Back Button (Initial State) */}
      <View style={styles.transparentHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.glassIcon}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.glassIcon}>
            <Icon name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassIcon}>
            <Icon name="share-variant" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={restaurantData.image}
            style={[styles.heroImage, { transform: [{ scale: imageScale }] }]}
          />
          {/* <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          /> */}
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.mainInfoCard}>
          <View style={styles.infoContent}>
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>{restaurantData.name}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingValue}>{restaurantData.rating}</Text>
                <Icon name="star" size={14} color="#FFF" />
              </View>
            </View>

            <Text style={styles.cuisineText}>{restaurantData.cuisine}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={14} color="#FF6B00" />
              <Text style={styles.locationText}>
                {restaurantData.address} • {restaurantData.distance}
              </Text>
            </View>

            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Icon name="clock-outline" size={16} color="#FF6B00" />
                </View>
                <Text style={styles.featureText}>
                  {restaurantData.deliveryTime}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Icon
                    name="silverware-fork-knife"
                    size={16}
                    color="#FF6B00"
                  />
                </View>
                <Text style={styles.featureText}>Premium</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Icon name="wallet-outline" size={16} color="#FF6B00" />
                </View>
                <Text style={styles.featureText}>Offers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Full Menu</Text>
          </View>

          {menuItems.map(item => (
            <View key={item.id}>{renderMenuItem({ item })}</View>
          ))}
        </View>

        {/* Extra spacing for cart bar */}
        <View style={{ height: totalQuantity > 0 ? 100 : 40 }} />
      </Animated.ScrollView>

      {/* Floating Cart Bar */}
      {totalQuantity > 0 && (
        <Animated.View style={styles.cartBarContainer}>
          <TouchableOpacity
            style={styles.cartBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Home', { screen: 'Cart' })}
          >
            <View style={styles.cartBarInfo}>
              <View style={styles.cartCountCircle}>
                <Text style={styles.cartCountText}>{totalQuantity}</Text>
              </View>
              <View style={styles.cartPriceInfo}>
                <Text style={styles.cartPriceText}>₹{totalPrice}</Text>
                <Text style={styles.cartVatText}>Plus Taxes</Text>
              </View>
            </View>
            <View style={styles.viewCartAction}>
              <Text style={styles.viewCartText}>VIEW CART</Text>
              <Icon name="chevron-right" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  // Header Styles
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 80,
    backgroundColor: '#FFF',
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  fixedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fixedHeaderTitle: {
    flex: 1,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
    color: '#333',
    marginLeft: 12,
  },
  transparentHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 101,
  },
  glassIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  // Hero Styles
  heroContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  // Info Card Styles
  mainInfoCard: {
    marginTop: -40,
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: scale(22),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
    flex: 1,
    paddingRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48c479',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingValue: {
    color: '#FFF',
    fontFamily: Fonts.BOLD,
    fontSize: 14,
  },
  cuisineText: {
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  locationText: {
    fontFamily: Fonts.MEDUIM,
    color: '#888',
    fontSize: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  featureItem: {
    alignItems: 'center',
    gap: 5,
  },
  featureIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: Fonts.BOLD,
    fontSize: 11,
    color: '#333',
  },
  // Offers Styles
  offersScroll: {
    marginTop: 20,
    paddingLeft: 16,
  },
  offerCard: {
    width: width * 0.7,
    padding: 16,
    borderRadius: 15,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerTitle: {
    fontFamily: Fonts.BOLD,
    fontSize: 18,
    color: '#FFF',
  },
  offerSubtitle: {
    fontFamily: Fonts.MEDUIM,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  // Menu Styles
  menuContainer: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontFamily: Fonts.BOLD,
    fontSize: 20,
    color: '#1a1a1a',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 6,
  },
  filterText: {
    fontFamily: Fonts.BOLD,
    fontSize: 12,
    color: '#666',
  },
  menuItemCard: {
    marginBottom: 25,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 15,
  },
  vegIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  vegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bestsellerBadge: {
    backgroundColor: '#FFF1EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestsellerText: {
    fontSize: 9,
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  menuItemName: {
    fontFamily: Fonts.BOLD,
    fontSize: 16,
    color: '#1a1a1a',
  },
  menuItemPrice: {
    fontFamily: Fonts.BOLD,
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
  menuItemDescription: {
    fontFamily: Fonts.MEDUIM,
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    lineHeight: 18,
  },
  menuItemImageContainer: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  menuItemImage: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },
  addBtnContainer: {
    position: 'absolute',
    bottom: -12,
    alignSelf: 'center',
    width: '80%',
  },
  addButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontFamily: Fonts.BOLD,
    fontSize: 14,
    color: '#FF6B00',
  },
  addIcon: {
    marginLeft: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF6B00',
    height: 36,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityButton: {
    paddingHorizontal: 8,
  },
  quantityText: {
    fontFamily: Fonts.BOLD,
    fontSize: 14,
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 25,
  },
  // Floating Cart Bar
  cartBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  cartBar: {
    backgroundColor: '#FF6B00',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  cartBarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartCountCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: Fonts.BOLD,
  },
  cartPriceInfo: {
    gap: 1,
  },
  cartPriceText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.BOLD,
  },
  cartVatText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontFamily: Fonts.MEDUIM,
  },
  viewCartAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewCartText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    letterSpacing: 0.5,
  },
});

export default RestaurantDetails;
