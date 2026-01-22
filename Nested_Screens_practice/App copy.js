import { StyleSheet, Text, View, Button, StackActions, NavigationActions, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import splacedScreen from './3Nested_Screens_practice/SplacedScreen';
import logginScreen from './3Nested_Screens_practice/logginScreen';
import signUpScreen from './3Nested_Screens_practice/signUpScreen';
import ForgotPassword from './3Nested_Screens_practice/ForgotPassword';
import welcomeScreen from './3Nested_Screens_practice/welcomeScreen';
import onbordeingscreen from './3Nested_Screens_practice/onbordeingscreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentBillingScreen from './3Nested_Screens_practice/PaymentBilling';
import { createStaticNavigation, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext, AuthProvider } from './3Nested_Screens_practice/AuthContext';
import groceryScreen from './3Nested_Screens_practice/groceryScreen ';
import carScreen from './3Nested_Screens_practice/carScreen';
import accountScreen from './3Nested_Screens_practice/accountScreen';
import { CartProvider } from './3Nested_Screens_practice/CartContext';
import ordered from './3Nested_Screens_practice/ordered';
import restaurantScreen from './3Nested_Screens_practice/restaurantScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// const Homescreen = createNativeStackNavigator({
//   initialRouteName: 'Welcome',
//   screenOptions: {
//     headerShown: false
//   },
//   screens: {
//     Welcome: welcomeScreen,
//     // Logout: logoutScreen
//   },
// });

const TabBarButton = (props) => (
  <TouchableOpacity
    {...props}
    activeOpacity={1} // Prevents the default ripple effect
  />)

function Homescreen() {


  return (

    <Tab.Navigator initialRouteName='Welcome' screenOptions={{
      headerShown: false,
      tabBarStyle: { height: verticalScale(55), paddingTop: 6, alignItems: 'center', backgroundColor: 'white', },
      tabBarLabelStyle: {
        fontSize: scale(12.5),
        fontWeight: 600,
        color: 'black',
        marginTop: 2
      },
      tabBarHideOnKeyboard: true,
      tabBarButton: (props) => <TabBarButton {...props} />,
    }}>
      <Tab.Screen name="Welcome" component={welcomeScreen} options={{
        headerShown: false,
        title: 'Home',
        tabBarIcon: ({ focused }) => (
          <View style={{
            backgroundColor: focused ? '#FFE8DF' : 'transparent', // Custom background color
            paddingVertical: 5, // Padding for better visibility
            paddingHorizontal: 16,
            borderRadius: 9,

          }}>
            <Image
              style={{ height: verticalScale(20), width: scale(20) }} // Adjusted size
              source={focused ? (require("./3Nested_Screens_practice/Images/icons8-home-10.png")) : (require("./3Nested_Screens_practice/Images/icons8-home-100.png"))}
            />
          </View>
        ),
      }} />
      <Tab.Screen name="Grocery" component={groceryScreen} options={{
        headerShown: false, tabBarIcon: ({ focused }) => (
          <View style={{
            backgroundColor: focused ? '#FFE8DF' : 'transparent', // Custom background color
            paddingVertical: 5,
            paddingHorizontal: 16,
            borderRadius: 9,

          }}>
            <Image
              style={{ height: verticalScale(20), width: scale(20) }} // Adjusted size
              source={focused ? (require("./3Nested_Screens_practice/Images/icons8-grocery-10.png")) : (require("./3Nested_Screens_practice/Images/icons8-grocery-100.png"))}
            />
          </View>
        ),
      }} />
      <Tab.Screen name="Cart" component={carScreen} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={{
            backgroundColor: focused ? '#FFE8DF' : 'transparent', // Custom background color
            paddingVertical: 5, paddingHorizontal: 16,
            borderRadius: 9,

          }}>
            <Image
              style={{ height: verticalScale(20), width: scale(20) }} // Adjusted size
              source={focused ? (require("./3Nested_Screens_practice/Images/icons8-cart-10.png")) : (require("./3Nested_Screens_practice/Images/icons8-cart-100.png"))}
            /></View>
        ),
      }} />
      <Tab.Screen name="Account" component={accountScreen} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={{
            backgroundColor: focused ? '#FFE8DF' : 'transparent', // Custom background color
            paddingVertical: 5, paddingHorizontal: 16,
            borderRadius: 9,

          }}>
            <Image
              style={{ height: verticalScale(20), width: scale(20) }} // Adjusted size
              source={focused ? (require("./3Nested_Screens_practice/Images/icons8-user-10.png")) : (require("./3Nested_Screens_practice/Images/icons8-user-100.png"))}
            /></View>
        ),
      }} />
    </Tab.Navigator>
  );
}



// const AuthScreen = createNativeStackNavigator({
//   initialRouteName: 'Onbording',
//   screenOptions: {
//     headerShown: false
//   },
//   screens: {
//     Onbording: onbordeingscreen,
//     Login: {
//       screen: logginScreen,
//     },
//     Signup: signUpScreen,
//     forgetPassword: ForgotPassword,
//   },
// });
// for header transparent headerTransparent: true,
function AuthScreen() {

  return (
    <Stack.Navigator initialRouteName='Onbording' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onbording" component={onbordeingscreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={logginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={signUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="forgetPassword" component={ForgotPassword} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
function paymentScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PaymentBilling" component={PaymentBillingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="orderd" component={ordered} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

function restaurent() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RestaurantScreen" component={restaurantScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );

}




// const RootStack = createNativeStackNavigator({

//   initialRouteName: 'Splaced',
//   screens: {
//     Splaced: {
//       screen: splacedScreen,
//       options: {
//         headerShown: false
//       }
//     },
//     Auth: {
//       screen: AuthScreen,
//       options: {
//         headerShown: false,
//       },
//     },
//     Home: {
//       screen: Homescreen,
//       options: {
//         headerShown: false,
//       },
//     },
//   },
// });



function RootStack() {


  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Splaced" component={splacedScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Home" component={Homescreen} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={paymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Restaurant" component={restaurent} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}



// const Navigation = createStaticNavigation(RootStack);

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </CartProvider>
  );

}

export default App

const styles = StyleSheet.create({})