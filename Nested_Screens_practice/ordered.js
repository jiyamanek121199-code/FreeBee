import {
  StyleSheet,
  Text,
  View,
  Button,
  StackActions,
  NavigationActions,
  ImageBackground,
  Image,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Fonts2 from '../Fonts2';
import { CartContext } from './CartContext';

const ordered = () => {
  const navigation = useNavigation();
  const [visible, setvisibale] = useState(false);
  const { placeOrder } = useContext(CartContext);

  useEffect(() => {
    // Place the order when this screen loads
    placeOrder({ estimatedMinutes: 30 });

    setvisibale(true);
    const timeoutId = setTimeout(() => {
      navigation.replace('Home', { screen: 'Welcome' });
      setvisibale(false);
    }, 2100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f3f0',
      }}
    >
      <View style={styles.main}>
        {visible ? (
          <FastImage
            style={{
              height: 150,
              width: 200,
              alignSelf: 'center',
              marginTop: 10,
            }}
            source={require('./Images/ERWXTp7RGR.gif')}
          />
        ) : null}
        <Text
          style={{
            fontFamily: Fonts2.BOLD,
            fontSize: 20,
            marginTop: 20,
            alignSelf: 'center',
          }}
        >
          Your order is placed
        </Text>
      </View>
    </View>
  );
};

export default ordered;

const styles = StyleSheet.create({
  main: {
    height: 300,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
  },
});
