import {
  StyleSheet,
  Text,
  View,
  Button,
  StackActions,
  NavigationActions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import splacedScreen from './Nested_Screens_practice/SplacedScreen';
import logginScreen from './Nested_Screens_practice/logginScreen';
import signUpScreen from './Nested_Screens_practice/signUpScreen';
import ForgotPassword from './Nested_Screens_practice/ForgotPassword';
import welcomeScreen from './Nested_Screens_practice/welcomeScreen';
import onbordeingscreen from './Nested_Screens_practice/onbordeingscreen';
import RestaurantDetails from './Nested_Screens_practice/RestaurantDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentBillingScreen from './Nested_Screens_practice/PaymentBilling';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AuthContext,
  AuthProvider,
} from './Nested_Screens_practice/AuthContext';
import groceryScreen from './Nested_Screens_practice/groceryScreen ';
import carScreen from './Nested_Screens_practice/carScreen';
import accountScreen from './Nested_Screens_practice/accountScreen';
import { CartProvider } from './Nested_Screens_practice/CartContext';
import ordered from './Nested_Screens_practice/ordered';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const TabBarButton = props => <TouchableOpacity {...props} activeOpacity={1} />;

function Homescreen() {
  return (
    <Tab.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarButton: props => <TabBarButton {...props} />,
      }}
    >
      <Tab.Screen
        name="Welcome"
        component={welcomeScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? '#FF6B00' : '#888888',
              }}
              source={
                focused
                  ? require('./Nested_Screens_practice/Images/icons8-home-10.png')
                  : require('./Nested_Screens_practice/Images/icons8-home-100.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Grocery"
        component={groceryScreen}
        options={{
          headerShown: false,
          title: 'Grocery',
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? '#FF6B00' : '#888888',
              }}
              source={
                focused
                  ? require('./Nested_Screens_practice/Images/icons8-grocery-10.png')
                  : require('./Nested_Screens_practice/Images/icons8-grocery-100.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={carScreen}
        options={{
          headerShown: false,
          title: 'Cart',
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? '#FF6B00' : '#888888',
              }}
              source={
                focused
                  ? require('./Nested_Screens_practice/Images/icons8-cart-10.png')
                  : require('./Nested_Screens_practice/Images/icons8-cart-100.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={accountScreen}
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? '#FF6B00' : '#888888',
              }}
              source={
                focused
                  ? require('./Nested_Screens_practice/Images/icons8-user-10.png')
                  : require('./Nested_Screens_practice/Images/icons8-user-100.png')
              }
            />
          ),
        }}
      />
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

function AuthScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Onbording"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Onbording"
        component={onbordeingscreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={logginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={signUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgetPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function paymentScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PaymentBilling"
        component={PaymentBillingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="orderd"
        component={ordered}
        options={{ headerShown: false }}
      />
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
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="Splaced">
          <Stack.Screen
            name="Splaced"
            component={splacedScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={Homescreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={paymentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Restaurant"
            component={RestaurantDetails}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
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
};

export default App;

const styles = StyleSheet.create({});
