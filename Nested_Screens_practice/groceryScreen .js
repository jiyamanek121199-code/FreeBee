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
} from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import Fonts from '../Fonts';
import PagerView from 'react-native-pager-view';
import { CartContext } from './CartContext';
import Fonts2 from '../Fonts2';
import { LogBox } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AddressModal from './AddressModal';
import ProductDetailModal from './ProductDetailModal';

const GroceryScreen = () => {
  LogBox.ignoreAllLogs();

  const Data = [
    {
      id: 1,
      link: require('./Images/depositphotos_201989724-stock-photo-fresh-fruits-white-background-removebg-preview.png'),
      name: 'Fruits',
    },
    {
      id: 2,
      link: require('./Images/basket-full-of-vegetables-removebg-preview.png'),
      name: 'Vegetables',
    },
    {
      id: 3,
      link: require('./Images/packaged-food-brands-1024x768-removebg-preview.png'),
      name: 'Packet Products',
    },
    {
      id: 4,
      link: require('./Images/cleaning-items-basket-isolated-white-background_93675-122107-removebg-preview.png'),
      name: 'Cleaning items',
    },
    {
      id: 5,
      link: require('./Images/bakery-products-isolated-on-the-white-background-DCH8FD-removebg-preview.png'),
      name: 'Bakery',
    },
    {
      id: 6,
      link: require('./Images/dummy10.png'),
      name: 'Frozen Food',
    },
    {
      id: 7,
      link: require('./Images/pantry-master-list-1389303-hero-01-9ffad227ac094f91911d33c508686919-removebg-preview.png'),
      name: 'pantry',
    },
  ];

  const Data_2 = [
    {
      id: 1,
      image: require('./Images/download-removebg-preview.png'),
      name: 'Banana',
      rating: require('./Images/rating1.png'),
      prices: '₹60',
      unit: 'kg',
      Quantiy: 0,
      freshness: 'Fresh Daily',
      description:
        'Premium quality ripe bananas, perfect for breakfast or as a healthy snack. Rich in potassium and natural energy.',
      details: [
        { label: 'Category', value: 'Fruits' },
        { label: 'Origin', value: 'Local Farm' },
        { label: 'Shelf Life', value: '5-7 days' },
      ],
      benefits: [
        'High in potassium for heart health',
        'Natural source of energy',
        'Rich in vitamins B6 and C',
      ],
    },
    {
      id: 2,
      image: require('./Images/download-removebg-preview2.png'),
      name: 'Kurkure',
      rating: require('./Images/rating2.png'),
      prices: '₹10',
      unit: 'pack',
      Quantiy: 0,
      freshness: 'Crispy & Fresh',
      description:
        'Crunchy and spicy namkeen snack that is perfect for tea time. Made with corn and rice, seasoned with aromatic spices.',
      details: [
        { label: 'Category', value: 'Snacks' },
        { label: 'Weight', value: '75g' },
        { label: 'Brand', value: 'Kurkure' },
      ],
      benefits: [
        'Perfect tea-time snack',
        'Unique twisted shape',
        'Bold masala flavor',
      ],
    },
    {
      id: 3,
      image: require('./Images/dummy5.png'),
      name: 'Maggi',
      rating: require('./Images/rating3.png'),
      prices: '₹12',
      unit: 'pack',
      Quantiy: 0,
      freshness: 'Ready in 2 mins',
      description:
        "India's favorite instant noodles. Quick, tasty and convenient meal for any time of the day.",
      details: [
        { label: 'Category', value: 'Instant Food' },
        { label: 'Weight', value: '70g' },
        { label: 'Brand', value: 'Nestle' },
      ],
      benefits: [
        'Ready in just 2 minutes',
        'Classic masala taste',
        'Perfect for quick meals',
      ],
    },
    {
      id: 4,
      image: require('./Images/images-removebg-previ.png'),
      name: 'Lays',
      rating: require('./Images/rating3.png'),
      prices: '₹15',
      unit: 'pack',
      Quantiy: 0,
      freshness: 'Crispy Fresh',
      description:
        'Classic salted potato chips, thinly sliced and perfectly crispy. A timeless snack loved by all.',
      details: [
        { label: 'Category', value: 'Chips' },
        { label: 'Weight', value: '52g' },
        { label: 'Brand', value: 'PepsiCo' },
      ],
      benefits: [
        'Made from real potatoes',
        'Perfectly salted',
        'Light and crispy texture',
      ],
    },
  ];

  const Data_3 = [
    {
      id: 5,
      image: require('./Images/amul-taaza-milk-removebg-preview.png'),
      name: 'Amul Milk',
      rating: require('./Images/rating3.png'),
      prices: '₹28',
      unit: '500ml',
      freshness: 'Fresh Daily',
      description:
        'Fresh pasteurized toned milk from Amul. Perfect for daily consumption, tea, coffee, and cooking.',
      details: [
        { label: 'Category', value: 'Dairy' },
        { label: 'Brand', value: 'Amul' },
        { label: 'Fat Content', value: '3%' },
      ],
      benefits: [
        'Rich in calcium and protein',
        'Pasteurized for safety',
        'Perfect for tea and coffee',
      ],
    },
    {
      id: 6,
      image: require('./Images/dummy7.png'),
      name: 'Tata Salt',
      rating: require('./Images/rating1.png'),
      prices: '₹30',
      unit: 'kg',
      freshness: 'Vacuum Packed',
      description:
        "India's most trusted iodized salt. Tata Salt is known for its purity and consistent quality.",
      details: [
        { label: 'Category', value: 'Spices & Salt' },
        { label: 'Brand', value: 'Tata' },
        { label: 'Type', value: 'Iodized' },
      ],
      benefits: [
        'Fortified with iodine',
        'Triple refined for purity',
        'Essential for daily cooking',
      ],
    },
    {
      id: 7,
      image: require('./Images/png-transparent-white-bread-bakery-loaf-packaging-and-labeling-bread-package-food-baking-food-packaging-removebg-preview.png'),
      name: 'Bread',
      rating: require('./Images/rating3.png'),
      prices: '₹55',
      unit: 'pack',
      freshness: 'Baked Fresh',
      description:
        'Soft and fluffy white bread, perfect for sandwiches, toast, or as a side with meals.',
      details: [
        { label: 'Category', value: 'Bakery' },
        { label: 'Type', value: 'White Bread' },
        { label: 'Shelf Life', value: '4-5 days' },
      ],
      benefits: [
        'Soft and fluffy texture',
        'No preservatives added',
        'Perfect for breakfast',
      ],
    },
    {
      id: 8,
      image: require('./Images/cheese.png'),
      name: 'Amul Cheese',
      rating: require('./Images/rating3.png'),
      prices: '₹155',
      unit: '200g',
      freshness: 'Refrigerated',
      description:
        'Creamy processed cheese cubes from Amul. Great for sandwiches, burgers, pasta and more.',
      details: [
        { label: 'Category', value: 'Dairy' },
        { label: 'Brand', value: 'Amul' },
        { label: 'Type', value: 'Processed Cheese' },
      ],
      benefits: [
        'Rich and creamy taste',
        'High in calcium',
        'Versatile cooking ingredient',
      ],
    },
  ];

  const Data_4 = [
    {
      id: 9,
      image: require('./Images/cone.png'),
      name: 'Vadilal Cone',
      rating: require('./Images/rating3.png'),
      prices: '₹25',
      unit: 'piece',
      freshness: 'Frozen Fresh',
      description:
        'Delicious vanilla ice cream in a crispy wafer cone. A perfect treat for hot summer days.',
      details: [
        { label: 'Category', value: 'Ice Cream' },
        { label: 'Brand', value: 'Vadilal' },
        { label: 'Flavor', value: 'Vanilla' },
      ],
      benefits: [
        'Creamy vanilla flavor',
        'Crispy wafer cone',
        'Perfect summer treat',
      ],
    },
    {
      id: 10,
      image: require('./Images/candy.png'),
      name: 'Vadilal Candy',
      rating: require('./Images/rating3.png'),
      prices: '₹10',
      unit: 'piece',
      freshness: 'Frozen Fresh',
      description:
        'Refreshing orange flavored ice candy. A nostalgic treat that brings back childhood memories.',
      details: [
        { label: 'Category', value: 'Ice Cream' },
        { label: 'Brand', value: 'Vadilal' },
        { label: 'Flavor', value: 'Orange' },
      ],
      benefits: [
        'Refreshing citrus flavor',
        'Low calorie treat',
        'Perfect for kids',
      ],
    },
    {
      id: 11,
      image: require('./Images/istockphoto-1316780583-612x612-removebg-preview.png'),
      name: 'Gulab Jamun',
      rating: require('./Images/rating2.png'),
      prices: '₹180',
      unit: 'kg',
      freshness: 'Fresh Made',
      description:
        'Soft and spongy milk-solid dumplings soaked in cardamom-flavored sugar syrup. A classic Indian dessert.',
      details: [
        { label: 'Category', value: 'Sweets' },
        { label: 'Type', value: 'Indian Mithai' },
        { label: 'Shelf Life', value: '7 days' },
      ],
      benefits: [
        'Made with pure khoya',
        'Soaked in rich sugar syrup',
        'Perfect for celebrations',
      ],
    },
    {
      id: 12,
      image: require('./Images/kajukatli.png'),
      name: 'Kaju Katli',
      rating: require('./Images/rating3.png'),
      prices: '₹750',
      unit: 'kg',
      freshness: 'Fresh Made',
      description:
        'Premium cashew nut fudge delicately flavored with cardamom. A royal Indian sweet loved by all.',
      details: [
        { label: 'Category', value: 'Sweets' },
        { label: 'Type', value: 'Dry Fruit Sweet' },
        { label: 'Shelf Life', value: '15 days' },
      ],
      benefits: [
        'Made with premium cashews',
        'Silver foil coating',
        'Perfect gift item',
      ],
    },
  ];
  const [items, setItems] = useState(Data_2);
  const [likedItems, setLikedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // All products combined for search
  const allProducts = [...Data_2, ...Data_3, ...Data_4];

  // Category to products mapping
  const categoryProducts = {
    Fruits: ['Banana'],
    Vegetables: [],
    'Packet Products': ['Kurkure', 'Maggi', 'Lays'],
    'Cleaning items': [],
    Bakery: ['Bread'],
    'Frozen Food': ['Vadilal Cone', 'Vadilal Candy'],
    pantry: ['Amul Milk', 'Tata Salt', 'Amul Cheese'],
  };

  // Get products filtered by selected category
  const getCategoryFilteredProducts = () => {
    if (!selectedCategory) return [];
    const productNames = categoryProducts[selectedCategory] || [];
    return allProducts.filter(product =>
      productNames.some(
        name =>
          product.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(product.name.toLowerCase()),
      ),
    );
  };

  // Filter products based on search
  const getFilteredProducts = productList => {
    if (!searchQuery.trim()) return productList;
    return productList.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // Toggle like for an item
  const toggleLike = itemId => {
    setLikedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const isLiked = itemId => likedItems.includes(itemId);

  const increaseQuantity = id => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, Quantiy: item.Quantiy + 1 } : item,
      ),
    );
  };
  const DecreseQuality = id => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, Quantiy: item.Quantiy - 1 } : item,
      ),
    );
  };
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const Pageref = useRef(null);
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

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
  const [userName, setUserName] = useState('');
  const [Ne, setNe] = useState();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductPress = product => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image
              style={styles.searchIcon}
              source={require('./Images/icons8-search-1.png')}
            />
            <TextInput
              style={styles.searchInput}
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
              placeholder="Search for groceries..."
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

        {/* Banner Carousel - Hide when searching */}
        {!searchQuery.trim() && (
          <>
            <PagerView
              style={styles.bannerPager}
              initialPage={0}
              ref={pagerRef}
              onPageSelected={e => setPage(e.nativeEvent.position)}
            >
              <View key="1" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/jiomartgroceryshopping.jpg')}
                />
              </View>
              <View key="2" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/dummy11.jpg')}
                />
              </View>
              <View key="3" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/dummy8.jpg')}
                />
              </View>
              <View key="4" style={styles.bannerSlide}>
                <Image
                  style={styles.bannerImage}
                  source={require('./Images/groceries-offers.jpg')}
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
          </>
        )}
        <View style={{ paddingHorizontal: verticalScale(15) }}>
          {/* Categories - Hide when searching */}
          {!searchQuery.trim() && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    marginTop: 9,
                    fontFamily: Fonts.BOLD,
                    fontSize: scale(18),
                    flex: 1,
                  }}
                >
                  Categories
                </Text>
              </View>

              <FlatList
                data={Data}
                horizontal={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      if (selectedCategory === item.name) {
                        setSelectedCategory(null); // Deselect if already selected
                      } else {
                        setSelectedCategory(item.name);
                      }
                    }}
                    style={{
                      paddingVertical: verticalScale(1),
                      width: scale(85),
                      justifyContent: 'center',
                      paddingLeft: 5,
                      marginTop: 5,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={[
                        styles.options,
                        selectedCategory === item.name && {
                          borderWidth: 2,
                          borderColor: '#000000',
                        },
                      ]}
                    >
                      <Image
                        style={{
                          height: verticalScale(45),
                          width: scale(65),
                          resizeMode: 'cover',
                        }}
                        source={item.link}
                      />
                    </View>
                    <View style={{ height: 50, width: 100 }}>
                      <Text
                        style={{
                          fontFamily:
                            selectedCategory === item.name
                              ? Fonts.BOLD
                              : Fonts.MEDUIM,
                          fontSize: scale(12),
                          marginTop: 8,
                          paddingRight: 12,
                          textAlign: 'center',
                          flexWrap: 'wrap',
                          color:
                            selectedCategory === item.name ? '#000000' : '#333',
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}

          {/* Conditional Rendering: Show filtered products or default sections */}
          {selectedCategory ? (
            // Show only filtered products when a category is selected
            <>
              <View style={{ marginTop: 15, marginBottom: 10 }}>
                <Text
                  style={{
                    fontFamily: Fonts.BOLD,
                    fontSize: scale(18),
                  }}
                >
                  {selectedCategory}
                </Text>
              </View>
              {getCategoryFilteredProducts().length > 0 ? (
                <FlatList
                  data={getCategoryFilteredProducts().map(item => {
                    const cartItem = cartItems.find(
                      cartItem => cartItem.id === item.id,
                    );
                    return cartItem
                      ? { ...item, Quantiy: cartItem.Quantiy }
                      : item;
                  })}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <View style={styles.box}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handleProductPress(item)}
                        style={styles.box_content}
                      >
                        <View style={styles.box_image_container}>
                          <Image
                            style={{ height: 85, width: 85 }}
                            source={item.image}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.likeButton}
                          onPress={() => toggleLike(item.id)}
                        >
                          <Image
                            source={require('./Images/icons8-heart-100.png')}
                            style={{
                              height: 24,
                              width: 24,
                              tintColor: isLiked(item.id) ? '#FF4444' : '#999',
                            }}
                          />
                        </TouchableOpacity>

                        <Text style={styles.box_Text}>{item.name}</Text>
                        <Image
                          style={styles.box_ratting}
                          source={item.rating}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={styles.box_price}>{item.prices}</Text>
                          {item.unit && (
                            <Text style={styles.box_unit}>/{item.unit}</Text>
                          )}
                        </View>
                      </TouchableOpacity>

                      {item.Quantiy === 0 || !item.Quantiy ? (
                        <TouchableOpacity
                          style={styles.box_cart}
                          onPress={() => addToCart(item)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={{
                              fontSize: scale(18),
                              color: 'white',
                              fontWeight: '900',
                            }}
                          >
                            +
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.box_cart_expanded}>
                          <TouchableOpacity
                            style={styles.cart_button}
                            onPress={() => removeFromCart(item.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.cart_button_text}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.cart_quantity}>
                            {item.Quantiy}
                          </Text>
                          <TouchableOpacity
                            style={styles.cart_button}
                            onPress={() => addToCart(item)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.cart_button_text}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                  keyExtractor={item => `category-${item.id.toString()}`}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Image
                    source={require('./Images/icons8-search-1.png')}
                    style={{
                      height: 60,
                      width: 60,
                      tintColor: '#BDBDBD',
                      marginBottom: 15,
                    }}
                  />
                  <Text style={styles.emptyText}>No data found</Text>
                  <Text style={styles.emptySubtext}>
                    No products available for {selectedCategory}
                  </Text>
                </View>
              )}
            </>
          ) : (
            // Show default sections when no category is selected
            <>
              {/* Top pickup - show header only when not searching */}
              {!searchQuery.trim() && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      marginTop: 9,
                      fontFamily: Fonts.BOLD,
                      fontSize: scale(18),
                      flex: 1,
                    }}
                  >
                    Top pickup of Yours
                  </Text>
                </View>
              )}

              {/* Search Results Label */}
              {searchQuery.trim() && (
                <View style={{ marginTop: 10, marginBottom: 5 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.BOLD,
                      fontSize: scale(18),
                    }}
                  >
                    Search Results
                  </Text>
                </View>
              )}

              <FlatList
                data={getFilteredProducts(items).map(item => {
                  const cartItem = cartItems.find(
                    cartItem => cartItem.id === item.id,
                  );
                  return cartItem
                    ? { ...item, Quantiy: cartItem.Quantiy }
                    : item;
                })}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={styles.box}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleProductPress(item)}
                      style={styles.box_content}
                    >
                      <View style={styles.box_image_container}>
                        <Image
                          style={{ height: 85, width: 85 }}
                          source={item.image}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => toggleLike(item.id)}
                      >
                        <Image
                          source={require('./Images/icons8-heart-100.png')}
                          style={{
                            height: 24,
                            width: 24,
                            tintColor: isLiked(item.id) ? '#FF4444' : '#999',
                          }}
                        />
                      </TouchableOpacity>

                      <Text style={styles.box_Text}>{item.name}</Text>
                      <Image style={styles.box_ratting} source={item.rating} />
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 2,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.box_price}>{item.prices}</Text>
                        {item.unit && (
                          <Text style={styles.box_unit}>/{item.unit}</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    {item.Quantiy === 0 || !item.Quantiy ? (
                      <TouchableOpacity
                        style={styles.box_cart}
                        onPress={() => addToCart(item)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={{
                            fontSize: scale(18),
                            color: 'white',
                            fontWeight: '900',
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.box_cart_expanded}>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => removeFromCart(item.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.cart_quantity}>{item.Quantiy}</Text>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => addToCart(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
              />

              {/* Routines items - hide header when searching */}
              {!searchQuery.trim() && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      marginTop: 9,
                      fontFamily: Fonts.BOLD,
                      fontSize: 22,
                      flex: 1,
                    }}
                  >
                    Routines items
                  </Text>
                </View>
              )}

              <FlatList
                data={getFilteredProducts(Data_3).map(item => {
                  const cartItem = cartItems.find(
                    cartItem => cartItem.id === item.id,
                  );
                  return cartItem
                    ? { ...item, Quantiy: cartItem.Quantiy }
                    : item;
                })}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={styles.box}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleProductPress(item)}
                      style={styles.box_content}
                    >
                      <View style={styles.box_image_container}>
                        <Image
                          style={{ height: 85, width: 85 }}
                          source={item.image}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => toggleLike(item.id)}
                      >
                        <Image
                          source={require('./Images/icons8-heart-100.png')}
                          style={{
                            height: 24,
                            width: 24,
                            tintColor: isLiked(item.id) ? '#FF4444' : '#999',
                          }}
                        />
                      </TouchableOpacity>

                      <Text style={styles.box_Text}>{item.name}</Text>
                      <Image style={styles.box_ratting} source={item.rating} />
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 2,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.box_price}>{item.prices}</Text>
                        {item.unit && (
                          <Text style={styles.box_unit}>/{item.unit}</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    {item.Quantiy === 0 || !item.Quantiy ? (
                      <TouchableOpacity
                        style={styles.box_cart}
                        onPress={() => addToCart(item)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={{
                            fontSize: scale(18),
                            color: 'white',
                            fontWeight: '900',
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.box_cart_expanded}>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => removeFromCart(item.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.cart_quantity}>{item.Quantiy}</Text>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => addToCart(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
              />

              {/* Sweets/Ice cream - hide header when searching */}
              {!searchQuery.trim() && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      marginTop: 9,
                      fontFamily: Fonts.BOLD,
                      fontSize: 22,
                      flex: 1,
                    }}
                  >
                    Sweets/Ice cream
                  </Text>
                </View>
              )}

              <FlatList
                data={getFilteredProducts(Data_4).map(item => {
                  const cartItem = cartItems.find(
                    cartItem => cartItem.id === item.id,
                  );
                  return cartItem
                    ? { ...item, Quantiy: cartItem.Quantiy }
                    : item;
                })}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={styles.box}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleProductPress(item)}
                      style={styles.box_content}
                    >
                      <View style={styles.box_image_container}>
                        <Image
                          style={{ height: 85, width: 85 }}
                          source={item.image}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => toggleLike(item.id)}
                      >
                        <Image
                          source={require('./Images/icons8-heart-100.png')}
                          style={{
                            height: 24,
                            width: 24,
                            tintColor: isLiked(item.id) ? '#FF4444' : '#999',
                          }}
                        />
                      </TouchableOpacity>

                      <Text style={styles.box_Text}>{item.name}</Text>
                      <Image style={styles.box_ratting} source={item.rating} />
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 2,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.box_price}>{item.prices}</Text>
                        {item.unit && (
                          <Text style={styles.box_unit}>/{item.unit}</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    {item.Quantiy === 0 || !item.Quantiy ? (
                      <TouchableOpacity
                        style={styles.box_cart}
                        onPress={() => addToCart(item)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={{
                            fontSize: scale(18),
                            color: 'white',
                            fontWeight: '900',
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.box_cart_expanded}>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => removeFromCart(item.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.cart_quantity}>{item.Quantiy}</Text>
                        <TouchableOpacity
                          style={styles.cart_button}
                          onPress={() => addToCart(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cart_button_text}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Address Modal */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onAddressSelect={address => setSelectedAddress(address)}
        selectedAddressId={selectedAddress?.id}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </View>
  );
};

export default GroceryScreen;

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

  // Search Styles
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
    fontFamily: Fonts.MEDUIM,
    color: '#333',
    marginLeft: 10,
    paddingVertical: 0,
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

  // Category Options
  options: {
    height: verticalScale(62),
    width: scale(65),
    backgroundColor: '#FFE8DF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    alignSelf: 'center',
  },

  // Product Box Styles
  box: {
    height: verticalScale(185),
    width: scale(155),
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 0.5,
    marginRight: 12,
    marginBottom: 15,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  box_image_container: {
    height: verticalScale(85),
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box_Text: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(14),
    marginLeft: 12,
    marginTop: 8,
    color: '#1a1a1a',
  },
  box_ratting: {
    height: verticalScale(14),
    width: scale(75),
    resizeMode: 'contain',
    marginLeft: 12,
    marginTop: 4,
  },
  box_price: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(16),
    marginLeft: 12,
    marginTop: 4,
    color: '#FF6B00',
  },
  box_unit: {
    fontFamily: Fonts.MEDUIM,
    fontSize: scale(12),
    color: '#888',
    marginTop: 4,
  },
  box_content: {
    flex: 1,
  },
  box_cart: {
    height: verticalScale(34),
    width: scale(38),
    position: 'absolute',
    backgroundColor: '#FF6B00',
    bottom: 10,
    right: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  box_cart_expanded: {
    height: verticalScale(34),
    width: scale(90),
    position: 'absolute',
    backgroundColor: '#FF6B00',
    bottom: 10,
    right: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    elevation: 3,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cart_button: {
    width: scale(26),
    height: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cart_button_text: {
    fontSize: scale(18),
    color: 'white',
    fontWeight: '700',
  },
  cart_quantity: {
    fontSize: scale(15),
    color: 'white',
    fontWeight: '700',
    minWidth: scale(20),
    textAlign: 'center',
  },
  // Like Button
  likeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
  // Clear Button for Search
  clearButton: {
    padding: 8,
    marginLeft: 4,
  },
  clearText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 8,
  },
});
