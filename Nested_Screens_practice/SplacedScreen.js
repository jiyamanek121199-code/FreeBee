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
import React, { useState, useEffect } from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { LogBox } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

function splacedScreen() {
  LogBox.ignoreAllLogs();

  const navigation = useNavigation();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      //const userdetails = await AsyncStorage.getItem('UsersDetails');
      setTimeout(() => {
        if (isLoggedIn === 'true') {
          // User is already logged in, go to Home
          navigation.replace('Home', { screen: 'Welcome' });
          //console.log(userdetails);
        } else {
          // User not logged in, go to Auth
          navigation.replace('Auth', { screen: 'Onbording' });
        }
      }, 1550);
    } catch (error) {
      // On error, default to Auth screen
      setTimeout(() => {
        navigation.replace('Auth', { screen: 'Onbording' });
      }, 1550);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
      }}
    >
      <ImageBackground
        style={{
          height: verticalScale(650),
          width: scale(500),
          position: 'absolute',
          opacity: 0.32,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('./Images/Background.png')}
      />
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontFamily: 'Gugi-Regular',
            fontSize: scale(60),
            color: 'white',
            textAlign: 'center',
            width: '100%',
            // backgroundColor: 'blue',
          }}
        >
          FreeBee
        </Text>
        <Text
          style={{
            fontFamily: 'Gugi-Regular',
            fontSize: scale(30),
            color: 'white',
            marginVertical: scale(10),
            textAlign: 'center',
            width: '100%',
            // backgroundColor: 'red',
          }}
        >
          X
        </Text>
        <Image
          source={require('./Images/icon.jpeg')}
          style={{
            height: scale(70),
            width: scale(210),
            borderRadius: scale(20),
            backgroundColor: 'green',
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default splacedScreen;

const styles = StyleSheet.create({});
