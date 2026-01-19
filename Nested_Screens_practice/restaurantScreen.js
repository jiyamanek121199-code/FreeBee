import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import Fonts2 from '../Fonts2';
import Fonts from '../Fonts';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const restaurantScreen = () => {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  const data = [
    {
      name: 'Punjabi Fix Thali',
      price: 201,
      rating: '4.0 (400)',
      image: require('./Images/punjabithali.jpg'),
    },
    {
      name: 'Gujrati Fix Thali',
      price: 190,
      rating: '4.1 (205)',
      image: require('./Images/vegetable-gujarati-kathiyawadi-thali-table-indian-meal-216317652.jpg'),
    },
    {
      name: 'Aloo Paratha',
      price: 180,
      rating: '4.5 (505)',
      image: require('./Images/Aloo-Paratha-Best-Recipe-Piping-Pot-Curry.jpg'),
    },
    {
      name: 'Veg Biryani',
      price: 99,
      rating: '3.9 (505)',
      image: require('./Images/Chettinad_Vegetable_Biryani_Recipe.jpg'),
    },
    {
      name: 'chinese bhel',
      price: 105,
      rating: '3.5 (50)',
      image: require('./Images/PHOTO-2021-12-06-12-01-26_1.jpg'),
    },
  ];

  const data1 = [
    {
      name: 'Pav Bhaji',
      price: 201,
      rating: '4.0 (400)',
      image: require('./Images/Pav-Bhaji-5-1_2048x.jpg'),
    },
    {
      name: 'Thepla ',
      price: 190,
      rating: '4.1 (205)',
      image: require('./Images/thepla.jpg'),
    },
    {
      name: 'Paneer Tikka Masala',
      price: 180,
      rating: '4.5 (505)',
      image: require('./Images/Paneer-tikka-masala-WS-500x500.jpg'),
    },
    {
      name: 'Paneer Butter Masala',
      price: 99,
      rating: '3.9 (505)',
      image: require('./Images/dummy2.jpg'),
    },
    {
      name: 'dal bhat',
      price: 105,
      rating: '3.5 (50)',
      image: require('./Images/Lasuni-dal-bhaat-WS.jpg'),
    },
    {
      name: 'Cheese Mutter Masala',
      price: 105,
      rating: '3.5 (50)',
      image: require('./Images/cheese.jpg'),
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 17,
          paddingTop: 20,
          backgroundColor: '#f9f3f0',
        }}
      >
        <Image
          source={require('./Images/istockphoto-1457979959-612x612.jpg')}
          style={styles.main_image}
        />

        <TouchableOpacity
          style={styles.baclbutton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20 }}
            source={require('./Images/icons8-back-100.png')}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginTop: 190, paddingTop: 20 }}>
          <View style={styles.view_under_image}>
            <Text style={styles.restaurant_name}>Rajdhani Restaurant</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Image
                style={{ height: 20, width: 20 }}
                source={require('./Images/icons8-star-100.png')}
              />
              <Text
                style={{
                  fontFamily: Fonts.MEDUIM,
                  fontSize: 13,
                  marginLeft: 10,
                }}
              >
                4.2 Rating (900+K Reviews)
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Image
                style={{ height: 20, width: 20 }}
                source={require('./Images/icons8-location-10.png')}
              />
              <Text
                style={{
                  fontFamily: Fonts.MEDUIM,
                  fontSize: 13,
                  marginLeft: 10,
                }}
              >
                Indira Circle,Rajkot,Gujrat
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ height: 20, width: 20 }}
                source={require('./Images/icons8-time-100.png')}
              />
              <Text
                style={{
                  fontFamily: Fonts.MEDUIM,
                  fontSize: 13,
                  marginLeft: 10,
                }}
              >
                15-20 minuts
              </Text>
            </View>
          </View>
          <View style={styles.search}>
            <TextInput
              style={{ fontSize: 15, flex: 0.98 }}
              onChangeText={text => {
                setUserName(text);
              }}
              value={userName}
              placeholder="Search for desis"
              returnKeyType="done"
              placeholderTextColor="#9a9a9a"
            />
            <Image
              style={{ height: 30, width: 30, position: 'absolute', right: 70 }}
              source={require('./Images/icons8-search-1.png')}
            />

            <View
              style={{
                height: 35,
                width: 35,
                borderRadius: 8,
                backgroundColor: '#ffede6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require('./Images/icons8-microphone-10.png')}
              />
            </View>
          </View>

          <View style={styles.options}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={[styles.options_name, { backgroundColor: '#FF6B00' }]}
              >
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'white' }}>
                  All items
                </Text>
              </View>
              <View style={styles.options_name}>
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'black' }}>
                  Most Popular
                </Text>
              </View>
              <View style={styles.options_name}>
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'black' }}>
                  Dishes
                </Text>
              </View>
              <View style={styles.options_name}>
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'black' }}>
                  Dinner
                </Text>
              </View>
              <View style={styles.options_name}>
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'black' }}>
                  Item at 99
                </Text>
              </View>
              <View style={styles.options_name}>
                <Text style={{ fontFamily: Fonts.MEDUIM, color: 'black' }}>
                  New launch
                </Text>
              </View>
            </ScrollView>
          </View>
          <View style={styles.items_container}>
            <Text
              style={{
                fontFamily: Fonts.BOLD,
                alignSelf: 'flex-start',
                fontSize: scale(18),
                marginBottom: 10,
              }}
            >
              Recommended(5)
            </Text>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <View style={styles.items}>
                  <View style={styles.logo}>
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 50,
                        backgroundColor: 'green',
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.SEMI_BOLD,
                      fontSize: 18,
                      marginTop: 3,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SEMI_BOLD,
                      fontSize: 17,
                      marginTop: 3,
                    }}
                  >
                    ₹{item.price}{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Image
                      style={{ height: 18, width: 18 }}
                      source={require('./Images/icons8-star-100.png')}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.MEDUIM,
                        fontSize: 13,
                        marginLeft: 6,
                        top: 2,
                      }}
                    >
                      {item.rating}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 22,
                      width: 100,
                      borderWidth: 0.5,
                      borderRadius: 9,
                    }}
                  >
                    <Text style={{ fontFamily: Fonts.REGULAR, fontSize: 12 }}>
                      More Details {'>'}
                    </Text>
                  </View>
                  <View style={styles.items_image}>
                    <Image
                      style={{
                        resizeMode: 'cover',
                        height: verticalScale(130),
                        width: scale(140),
                        borderRadius: 25,
                      }}
                      source={item.image}
                    />
                  </View>
                  <View style={styles.add_button}>
                    <Text
                      style={{
                        fontFamily: Fonts.BOLD,
                        fontSize: scale(17),
                        color: '#24e703',
                      }}
                    >
                      ADD
                    </Text>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
          <View style={[styles.items_container, { marginTop: 15 }]}>
            <Text
              style={{
                fontFamily: Fonts.BOLD,
                alignSelf: 'flex-start',
                fontSize: scale(18),
                marginBottom: 10,
              }}
            >
              Main Items(6)
            </Text>
            <FlatList
              data={data1}
              renderItem={({ item }) => (
                <View style={styles.items}>
                  <View style={styles.logo}>
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 50,
                        backgroundColor: 'green',
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.SEMI_BOLD,
                      fontSize: 18,
                      marginTop: 3,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SEMI_BOLD,
                      fontSize: 17,
                      marginTop: 3,
                    }}
                  >
                    ₹{item.price}{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Image
                      style={{ height: 18, width: 18 }}
                      source={require('./Images/icons8-star-100.png')}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.MEDUIM,
                        fontSize: 13,
                        marginLeft: 6,
                        top: 2,
                      }}
                    >
                      {item.rating}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 22,
                      width: 100,
                      borderWidth: 0.5,
                      borderRadius: 9,
                    }}
                  >
                    <Text style={{ fontFamily: Fonts.REGULAR, fontSize: 12 }}>
                      More Details {'>'}
                    </Text>
                  </View>
                  <View style={styles.items_image}>
                    <Image
                      style={{
                        resizeMode: 'cover',
                        height: verticalScale(130),
                        width: scale(140),
                        borderRadius: 25,
                      }}
                      source={item.image}
                    />
                  </View>
                  <View style={styles.add_button}>
                    <Text
                      style={{
                        fontFamily: Fonts.BOLD,
                        fontSize: scale(17),
                        color: '#24e703',
                      }}
                    >
                      ADD
                    </Text>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default restaurantScreen;

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  main_image: {
    height: 210,
    width: '110%',
    position: 'absolute',
  },
  baclbutton: {
    position: 'absolute',
    height: 50,
    width: 50,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurant_name: {
    fontSize: 25,
    fontFamily: Fonts.BOLD,
  },
  search: {
    height: 50,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginTop: 140,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 10,
  },
  view_under_image: {
    height: 150,
    width: '110%',
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    paddingLeft: 20,
    // borderBottomLeftRadius: 25,
    // borderBottomRightRadius: 25,
    paddingTop: 15,
  },
  options: {
    height: verticalScale(58),
    width: scale(390),
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    paddingLeft: 40,
    gap: 25,
    alignSelf: 'center',
    position: 'absolute',
    top: 208,
  },
  options_name: {
    height: verticalScale(32),
    paddingHorizontal: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    marginRight: 10,
  },
  items_container: {
    width: '110%',
    paddingVertical: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 90,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  items: {
    height: verticalScale(150),
    width: scale(325),
    backgroundColor: 'white',
  },
  logo: {
    height: 20,
    width: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  items_image: {
    position: 'absolute',
    backgroundColor: '#c7c7c7',
    height: verticalScale(130),
    width: scale(140),
    alignSelf: 'flex-end',
    right: 2,
    borderRadius: 25,
  },
  add_button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(31),
    backgroundColor: 'white',
    paddingHorizontal: 35,
    borderRadius: 10,
    alignSelf: 'flex-end',
    bottom: 5,
    right: 23,
    borderWidth: 0.2,
    elevation: 3,
  },
  separator: {
    marginTop: 10,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 0.2,
    borderColor: '#b7b7b7',
  },
});
