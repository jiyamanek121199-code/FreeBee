import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import Fonts from '../Fonts';
import Fonts2 from '../Fonts2';
import PagerView from 'react-native-pager-view';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AddressModal from './AddressModal';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const Data = [
    {
      id: 1,
      link: require('./Images/hamburger-isolated-on-white-background-F2C2K4-removebg-preview.png'),
      name: 'Burgers',
      color: '#FFE8DF',
    },
    {
      id: 2,
      link: require('./Images/pngtree-a-hot-fresh-cheesy-pizza-white-background-png-image_15702316-removebg-preview.png'),
      name: 'Pizza',
      color: '#FFF3E0',
    },
    {
      id: 3,
      link: require('./Images/club-sandwich-on-white-background-ai-generated-free-photo-removebg-preview.png'),
      name: 'Sandwich',
      color: '#E8F5E9',
    },
    {
      id: 4,
      link: require('./Images/delicious-chicken-biryani-with-leg-pieces-and-vegetable-slices-white-background-free-photo-removebg-preview.png'),
      name: 'Biryani',
      color: '#FFF8E1',
    },
    {
      id: 5,
      link: require('./Images/istockphoto-996505458-612x612-removebg-preview.png'),
      name: 'Shake',
      color: '#FCE4EC',
    },
    {
      id: 6,
      link: require('./Images/dummy9.png'),
      name: 'Dosa',
      color: '#F3E5F5',
    },
    {
      id: 7,
      link: require('./Images/images-removebg-preview.png'),
      name: 'Pasta',
      color: '#E3F2FD',
    },
    {
      id: 8,
      link: require('./Images/dummy14.png'),
      name: 'Cake',
      color: '#FFEBEE',
    },
    {
      id: 9,
      link: require('./Images/pngtree-best-food-samosa-white-background-png-image_18710971-removebg-preview.png'),
      name: 'Samosa',
      color: '#E8EAF6',
    },
  ];

  const Data_2 = [
    {
      id: 1,
      image: require('./Images/istockphoto-1457979959-612x612.jpg'),
      name: 'Rajdhani Restaurant',
      rating: '4.2',
      reviews: '945K',
      minutes: '15-20 min',
      cuisine: 'North Indian • Thali • Pure Veg',
      price: '₹300 for two',
      distance: '1.2 km',
      isOpen: true,
      discount: '20% OFF',
      featured: true,
    },
    {
      id: 2,
      image: require('./Images/indian-food-spicy-karhai-chicken-in-tomato-sauce-close-up-and-naan-on-the-table-horizontal-top-view-from-above-rustic-style-R9CEYW.jpg'),
      name: 'Big Bites',
      rating: '3.8',
      reviews: '45K',
      minutes: '19-25 min',
      cuisine: 'Fast Food • Burgers • Wraps',
      price: '₹200 for two',
      distance: '0.8 km',
      isOpen: true,
      discount: '10% OFF',
      featured: false,
    },
    {
      id: 3,
      image: require('./Images/istockphoto-1442417585-612x612.jpg'),
      name: 'Pizza Hut',
      rating: '4.5',
      reviews: '950K',
      minutes: '20-25 min',
      cuisine: 'Pizzas • Italian • Pasta',
      price: '₹400 for two',
      distance: '2.0 km',
      isOpen: true,
      discount: 'FREE Delivery',
      featured: true,
    },
    {
      id: 4,
      image: require('./Images/p08v90pv.jpg'),
      name: 'Dosa Hub',
      rating: '4.0',
      reviews: '145K',
      minutes: '15-20 min',
      cuisine: 'South Indian • Dosa • Idli',
      price: '₹150 for two',
      distance: '0.5 km',
      isOpen: true,
      discount: '₹50 OFF',
      featured: false,
    },
  ];

  const Data_3 = [
    {
      id: 1,
      image: require('./Images/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg'),
      name: 'Bole To Mumbai',
      rating: '4.8',
      reviews: '445K',
      minutes: '15-20 min',
      cuisine: 'Street Food • Pav Bhaji • Chaat',
      price: '₹180 for two',
      distance: '1.5 km',
      isOpen: true,
      discount: '30% OFF',
      featured: true,
    },
    {
      id: 2,
      image: require('./Images/PROD_Banner_1663162846668.jpg'),
      name: 'Ganesha',
      rating: '3.9',
      reviews: '45K',
      minutes: '19-25 min',
      cuisine: 'South Indian • North Indian',
      price: '₹250 for two',
      distance: '2.2 km',
      isOpen: true,
      discount: '15% OFF',
      featured: false,
    },
    {
      id: 3,
      image: require('./Images/images.jpg'),
      name: 'Pasta Hub',
      rating: '4.5',
      reviews: '950K',
      minutes: '20-25 min',
      cuisine: 'Italian • Continental • Pasta',
      price: '₹350 for two',
      distance: '1.8 km',
      isOpen: true,
      discount: 'Buy 1 Get 1',
      featured: true,
    },
  ];

  const Data_4 = [
    {
      id: 1,
      image: require('./Images/dummy12.jpg'),
      name: 'KFC',
      rating: '4.3',
      reviews: '795K',
      minutes: '35-40 min',
      cuisine: 'Fried Chicken • Burgers • Snacks',
      price: '₹350 for two',
      distance: '3.0 km',
      isOpen: true,
      discount: '25% OFF',
      featured: true,
    },
    {
      id: 2,
      image: require('./Images/macdolans.jpg'),
      name: "McDonald's",
      rating: '4.2',
      reviews: '845K',
      minutes: '19-25 min',
      cuisine: 'Burgers • Fast Food • Beverages',
      price: '₹300 for two',
      distance: '1.0 km',
      isOpen: true,
      discount: 'FREE Fries',
      featured: true,
    },
    {
      id: 3,
      image: require('./Images/Rolls.jpg'),
      name: 'Rolls For You',
      rating: '4.1',
      reviews: '125K',
      minutes: '20-25 min',
      cuisine: 'Rolls • Wraps • Chinese',
      price: '₹180 for two',
      distance: '0.7 km',
      isOpen: true,
      discount: '₹75 OFF',
      featured: false,
    },
  ];

  function restaurant(item) {
    navigation.navigate('Restaurant', {
      image: item.image,
      name: item.name,
      rating: item.rating,
      distance: item.distance,
      cuisine: item.cuisine,
      deliveryTime: item.minutes,
      info: `Welcome to ${item.name}! We serve authentic cuisine with a modern twist. Our chefs use fresh ingredients to create delicious dishes that will delight your taste buds.`,
    });
  }

  const Pageref = useRef(null);
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setPage(prevPage => {
        const nextPage = (prevPage + 1) % 4;
        pagerRef.current?.setPage(nextPage);
        return nextPage;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [Ne, setNe] = useState();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get active order from context
  const { activeOrder, clearActiveOrder } = useContext(CartContext);
  const [remainingTime, setRemainingTime] = useState(null);

  // Restaurant mapping for each category
  const categoryRestaurants = {
    Burgers: ["McDonald's", 'Ganesha', 'KFC'],
    Pizza: ['Pizza Hut'],
    Sandwich: ['Ganesha', 'Pasta Hub'],
    Biryani: ['Ganesha'],
    Shake: ["McDonald's", 'Big Bites'],
    Dosa: ['Dosa Hub'],
    Pasta: ['Pasta Hub', 'Big Bites'],
    Cake: ['Ganesha'],
    Samosa: ['Ganesha'],
  };

  // Get all restaurants combined for filtering
  const allRestaurants = [...Data_2, ...Data_3, ...Data_4];

  // Get filtered restaurants based on selected category
  const getFilteredRestaurants = () => {
    if (!selectedCategory) return [];
    const restaurantNames = categoryRestaurants[selectedCategory] || [];
    return allRestaurants.filter(restaurant =>
      restaurantNames.some(
        name =>
          restaurant.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(restaurant.name.toLowerCase()),
      ),
    );
  };

  // Get searched restaurants based on search query
  const getSearchedRestaurants = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allRestaurants.filter(
      restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query),
    );
  };

  // Countdown timer for delivery
  useEffect(() => {
    if (activeOrder) {
      const orderTime = new Date(activeOrder.placedAt).getTime();
      const deliveryMins = activeOrder.estimatedDelivery || 30;

      const updateTimer = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - orderTime) / 60000); // minutes elapsed
        const remaining = Math.max(0, deliveryMins - elapsed);
        setRemainingTime(remaining);

        // Clear order after estimated delivery time + 5 minutes
        if (remaining <= 0) {
          setTimeout(() => {
            clearActiveOrder();
          }, 5 * 60 * 1000); // Clear after 5 more minutes
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  // Load saved address on mount
  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const userData = await AsyncStorage.getItem('User');
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed.addresses && parsed.addresses.length > 0) {
            const defaultAddr =
              parsed.addresses.find(addr => addr.isDefault) ||
              parsed.addresses[0];
            setSelectedAddress(defaultAddr);
          }
        }
      } catch (error) {
        console.log('Error loading address:', error);
      }
    };
    loadSavedAddress();
  }, []);

  // Render Restaurant Card Component
  const RestaurantCard = ({ item, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => onPress(item)}
        activeOpacity={0.9}
      >
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image style={styles.restaurantImage} source={item.image} />
          {/* Discount Badge */}
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
          )}
          {/* Open Badge */}
          {/* <View
            style={[
              styles.openBadge,
              { backgroundColor: item.isOpen ? '#4CAF50' : '#F44336' },
            ]}
          >
            <View
              style={[
                styles.openDot,
                { backgroundColor: item.isOpen ? '#81C784' : '#EF9A9A' },
              ]}
            /> */}
          {/* <Text style={styles.openText}>
              {item.isOpen ? 'OPEN' : 'CLOSED'}
            </Text> */}
          {/* </View> */}
          {/* Delivery Time Overlay */}
          <View style={styles.deliveryTimeOverlay}>
            <Image
              style={{ height: 12, width: 12, tintColor: '#fff' }}
              source={require('./Images/icons8-clock-100.png')}
            />
            <Text style={styles.deliveryTimeText}>{item.minutes}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.cardContent}>
          {/* Restaurant Name & Featured Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>★ Featured</Text>
              </View>
            )}
          </View>

          {/* Cuisine Type */}
          <Text style={styles.cuisineText} numberOfLines={1}>
            {item.cuisine}
          </Text>

          {/* Rating & Reviews Row */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Image
                  style={styles.starIcon}
                  source={require('./Images/icons8-star-100.png')}
                />
              </View>
              <Text style={styles.reviewText}>{item.reviews} reviews</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>

          {/* Distance Row */}
          <View style={styles.distanceRow}>
            <Image
              style={styles.locationIcon}
              source={require('./Images/icons8-location-10.png')}
            />
            <Text style={styles.distanceText}>{item.distance} away</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Category Item Component
  const CategoryItem = ({ item, isSelected, onSelect }) => {
    return (
      <TouchableOpacity
        style={styles.categoryContainer}
        activeOpacity={0.7}
        onPress={() => onSelect(item.name)}
      >
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: item.color },
            isSelected && {
              borderWidth: 2,
              borderColor: '#000000',
            },
          ]}
        >
          <Image style={styles.categoryImage} source={item.link} />
        </View>
        <Text
          style={[
            styles.categoryName,
            isSelected && { color: '#000000', fontFamily: Fonts.BOLD },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Section Header Component
  const SectionHeader = ({ title, subtitle }) => {
    return (
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        {/* <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <Text style={styles.seeAllArrow}>→</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Pressable
            style={styles.addressContainer}
            onPress={() => {
              console.log('Address pressed, opening modal');
              setAddressModalVisible(true);
            }}
            android_ripple={{ color: 'rgba(255, 107, 0, 0.1)' }}
          >
            <View style={styles.locationIconContainer}>
              <Image
                style={styles.headerLocationIcon}
                source={require('./Images/icons8-location-10.png')}
              />
            </View>
            <View style={styles.addressTextContainer}>
              {selectedAddress ? (
                <>
                  <View style={styles.labelRow}>
                    <Text style={styles.addressLabel}>
                      {selectedAddress.label}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </View>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {selectedAddress.address}
                  </Text>
                </>
              ) : (
                <View style={styles.labelRow}>
                  <Text style={styles.addAddressText}>
                    Add Delivery Address
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        {/* Delivery Tracking Banner */}
        {activeOrder && (
          <TouchableOpacity
            style={styles.deliveryBanner}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Delivery')}
          >
            <View style={styles.deliveryIconContainer}>
              <Icon name="truck-fast" size={28} color="#fff" />
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Order on the way!</Text>
              <Text style={styles.deliverySubtitle}>
                {remainingTime !== null && remainingTime > 0
                  ? `Arriving in ${remainingTime} min`
                  : 'Arriving soon...'}
              </Text>
            </View>
            <View style={styles.deliveryTimeContainer}>
              <Text style={styles.deliveryTimeNumber}>
                {remainingTime !== null ? remainingTime : '--'}
              </Text>
              <Text style={styles.deliveryTimeLabel}>min</Text>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image
              style={styles.searchIcon}
              source={require('./Images/icons8-search-1.png')}
            />
            <TextInput
              style={styles.searchInput}
              onChangeText={text => {
                setSearchQuery(text);
                // Clear category selection when searching
                if (text.trim()) {
                  setSelectedCategory(null);
                }
              }}
              value={searchQuery}
              placeholder="Search restaurants, cuisines..."
              returnKeyType="search"
              placeholderTextColor="#9E9E9E"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hide banner, indicators, quick stats when searching */}
        {!searchQuery.trim() && (
          <>
            {/* Banner Carousel */}
            <PagerView
              style={styles.bannerPager}
              initialPage={0}
              ref={pagerRef}
              onPageSelected={e => setPage(e.nativeEvent.position)}
            >
              <View key="1" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/food-coupons.jpg')}
                />
              </View>
              <View key="2" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/eat-fit-coupons.jpg')}
                />
              </View>
              <View key="3" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/the-good-bowl-coupon.jpg')}
                />
              </View>
              <View key="4" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/maxresdefault.jpg')}
                />
              </View>
            </PagerView>

            {/* Page Indicators */}
            <View style={styles.indicatorContainer}>
              {[0, 1, 2, 3].map(index => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    page === index
                      ? styles.activeIndicator
                      : styles.inactiveIndicator,
                  ]}
                />
              ))}
            </View>

            {/* Quick Stats Section */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Restaurants</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>20 min</Text>
                <Text style={styles.statLabel}>Avg Delivery</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.5★</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="Search by food items!"
                subtitle="Suggestions"
              />
              <FlatList
                data={Data}
                horizontal={true}
                renderItem={({ item }) => (
                  <CategoryItem
                    item={item}
                    isSelected={selectedCategory === item.name}
                    onSelect={categoryName => {
                      if (selectedCategory === categoryName) {
                        setSelectedCategory(null); // Deselect if already selected
                      } else {
                        setSelectedCategory(categoryName);
                      }
                    }}
                  />
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              />
            </View>
          </>
        )}

        {/* Conditional Rendering: Search results, filtered restaurants, or default sections */}
        {searchQuery.trim() ? (
          // Show search results when searching
          <View style={styles.sectionContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                Search Results for "{searchQuery}"
              </Text>
              <Text style={styles.searchResultsCount}>
                {getSearchedRestaurants().length} restaurants found
              </Text>
            </View>
            <FlatList
              data={getSearchedRestaurants()}
              horizontal={true}
              renderItem={({ item }) => (
                <RestaurantCard item={item} onPress={restaurant} />
              )}
              keyExtractor={item => `search-${item.id}-${item.name}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.restaurantList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No restaurants found for "{searchQuery}"
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Try searching for restaurant name or cuisine type
                  </Text>
                </View>
              }
            />
          </View>
        ) : selectedCategory ? (
          // Show only filtered restaurants when a category is selected
          <View style={styles.filteredRestaurantsContainer}>
            <FlatList
              data={getFilteredRestaurants()}
              horizontal={true}
              renderItem={({ item }) => (
                <RestaurantCard item={item} onPress={restaurant} />
              )}
              keyExtractor={item => `filtered-${item.id}-${item.name}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.restaurantList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No restaurants found for {selectedCategory}
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          // Show default sections when no category is selected
          <>
            {/* Top Picks Section */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="Top Picks For You"
                subtitle="Based on your taste"
              />
              <FlatList
                data={Data_2}
                horizontal={true}
                renderItem={({ item }) => (
                  <RestaurantCard item={item} onPress={restaurant} />
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantList}
              />
            </View>

            {/* Top Rated Section */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="Top Rated Nearby"
                subtitle="Highest rated in your area"
              />
              <FlatList
                data={Data_3}
                horizontal={true}
                renderItem={({ item }) => (
                  <RestaurantCard item={item} onPress={restaurant} />
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantList}
              />
            </View>

            {/* Most Famous Section */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="Most Famous"
                subtitle="Popular restaurants"
              />
              <FlatList
                data={Data_4}
                horizontal={true}
                renderItem={({ item }) => (
                  <RestaurantCard item={item} onPress={restaurant} />
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantList}
              />
            </View>
          </>
        )}

        <View style={{ marginTop: 30 }}></View>
      </ScrollView>

      {/* Address Modal - Moved outside ScrollView for proper touch handling */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onAddressSelect={address => setSelectedAddress(address)}
        selectedAddressId={selectedAddress?.id}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Header Styles
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(12),
    paddingBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLocationIcon: {
    height: 22,
    width: 22,
    tintColor: '#FF6B00',
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#FF6B00',
    marginLeft: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    marginTop: 2,
  },
  addAddressText: {
    fontSize: 14,
    fontFamily: Fonts.MEDUIM,
    color: '#333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 22,
    height: 22,
    tintColor: '#666',
  },

  // Search Styles - Reduced Height
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBar: {
    height: verticalScale(42),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    height: 20,
    width: 20,
    tintColor: '#9E9E9E',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    color: '#333',
    marginLeft: 10,
    paddingVertical: 0,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: 18,
    height: 18,
    tintColor: '#FF6B00',
  },

  // Clear Button Styles
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },

  // Search Results Styles
  searchResultsHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: '#212121',
  },
  searchResultsCount: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: '#9E9E9E',
    marginTop: 2,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 8,
  },

  // Banner Styles
  bannerPager: {
    height: verticalScale(150),
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerSlide: {
    flex: 1,
  },
  bannerImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },

  // Indicator Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    borderRadius: 4,
  },
  activeIndicator: {
    width: 20,
    height: 6,
    backgroundColor: '#FF6B00',
  },
  inactiveIndicator: {
    width: 6,
    height: 6,
    backgroundColor: '#E0E0E0',
  },

  // Quick Stats Styles
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
  },

  // Section Styles
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: '#212121',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: '#9E9E9E',
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: Fonts.MEDUIM,
    color: '#FF6B00',
  },
  seeAllArrow: {
    fontSize: 14,
    color: '#FF6B00',
    marginLeft: 4,
  },

  // Category Styles
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    height: verticalScale(65),
    width: scale(65),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryImage: {
    height: verticalScale(50),
    width: scale(50),
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: Fonts.MEDUIM,
    color: '#424242',
    marginTop: 8,
    textAlign: 'center',
  },

  // Filtered Restaurants Container
  filteredRestaurantsContainer: {
    marginTop: 20,
  },
  emptyContainer: {
    width: width - 32,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.MEDUIM,
    color: '#9E9E9E',
    textAlign: 'center',
  },

  // Restaurant Card Styles
  restaurantList: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    width: scale(260),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 1,
    marginBottom: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: verticalScale(130),
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  restaurantImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
  },
  openBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  openText: {
    fontSize: 9,
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  deliveryTimeOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryTimeText: {
    fontSize: 11,
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
    marginLeft: 4,
  },

  // Card Content Styles
  cardContent: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    color: '#212121',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  cuisineText: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: '#757575',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
  },
  starIcon: {
    width: 10,
    height: 10,
    marginLeft: 2,
    tintColor: '#FFFFFF',
  },
  reviewText: {
    fontSize: 11,
    fontFamily: Fonts.REGULAR,
    color: '#9E9E9E',
    marginLeft: 6,
  },
  priceContainer: {},
  priceText: {
    fontSize: 11,
    fontFamily: Fonts.MEDUIM,
    color: '#757575',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: '#FF6B00',
  },
  distanceText: {
    fontSize: 11,
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    marginLeft: 4,
  },
  // Delivery Tracking Banner
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deliveryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 14,
  },
  deliveryTitle: {
    fontSize: scale(15),
    fontFamily: Fonts.BOLD,
    color: '#fff',
  },
  deliverySubtitle: {
    fontSize: scale(12),
    fontFamily: Fonts.MEDUIM,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  deliveryTimeContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  deliveryTimeNumber: {
    fontSize: scale(18),
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  deliveryTimeLabel: {
    fontSize: scale(10),
    fontFamily: Fonts.MEDUIM,
    color: '#666',
  },
  deliveryCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
