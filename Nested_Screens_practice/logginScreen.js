import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../Fonts';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height } = Dimensions.get('window');
const BUTTON_WIDTH = screenWidth - scale(48);

const LoginScreen = ({ route }) => {
  const navigation = useNavigation();
  const animation = useSharedValue(0);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const doSubmit = async () => {
    setUserNameError('');
    setPasswordError('');
    let isValid = true;

    if (!userName) {
      setUserNameError('Please enter your username');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    }

    if (!isValid) return;

    // Check AsyncStorage for saved users
    try {
      const usersData = await AsyncStorage.getItem('UsersDetails');

      if (!usersData) {
        Alert.alert('No Account Found', 'Please create an account first.');
        return;
      }

      const usersArray = JSON.parse(usersData);

      // Find user by username (case insensitive)
      const foundUser = usersArray.find(
        user => user.username.toLowerCase() === userName.toLowerCase(),
      );

      if (!foundUser) {
        setUserNameError('Invalid username');
        return;
      }

      if (foundUser.password !== password) {
        setPasswordError('Invalid password');
        return;
      }

      // Login successful - Save current user to 'User' key
      const currentUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
        // Initialize with empty arrays/objects for future use
        addresses: [],
        paymentMethods: [],
        profileImage: null,
      };

      // Check if User already has data, preserve them
      const existingUserData = await AsyncStorage.getItem('User');
      if (existingUserData) {
        const existingUser = JSON.parse(existingUserData);
        if (existingUser.id === foundUser.id) {
          // Same user logging in again, preserve their data
          currentUser.addresses = existingUser.addresses || [];
          currentUser.paymentMethods = existingUser.paymentMethods || [];
          currentUser.profileImage = existingUser.profileImage || null;
        }
      }

      await AsyncStorage.setItem('User', JSON.stringify(currentUser));

      // Navigate to home
      Tonavigate();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  function Tonavigate() {
    setIsLoading(true);
    animation.value = 1;

    // Save login state to AsyncStorage
    AsyncStorage.setItem('isLoggedIn', 'true').then(() => {
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace('Home', { screen: 'Welcome' });
      }, 1200);
    });
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value === 0
          ? withTiming(BUTTON_WIDTH, { duration: 300 })
          : withTiming(60, { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF8" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.logo}>FreeBee</Text>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your food journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'username' && styles.inputFocused,
                  userNameError && styles.inputError,
                ]}
              >
                <Image
                  style={styles.inputIcon}
                  source={require('./Images/icons8-user-100.png')}
                />
                <TextInput
                  style={styles.input}
                  ref={userNameRef}
                  placeholder="Enter your username"
                  onChangeText={text => {
                    setUserName(text);
                    setUserNameError('');
                  }}
                  value={userName}
                  placeholderTextColor="#B0B0B0"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current.focus()}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {userNameError ? (
                <Text style={styles.errorText}>{userNameError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputFocused,
                  passwordError && styles.inputError,
                ]}
              >
                <Image
                  style={styles.inputIcon}
                  source={require('./Images/icons8-shield-60.png')}
                />
                <TextInput
                  style={styles.input}
                  ref={passwordRef}
                  placeholder="Enter your password"
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  value={password}
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry={!isPasswordVisible}
                  returnKeyType="done"
                  onSubmitEditing={doSubmit}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeButton}
                >
                  <Image
                    style={styles.eyeIcon}
                    source={
                      isPasswordVisible
                        ? require('./Images/visibility_24dp_656565_FILL0_wght400_GRAD0_opsz24.png')
                        : require('./Images/visibility_off_24dp_656565_FILL0_wght400_GRAD0_opsz24.png')
                    }
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('forgetPassword')}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            {isLoading ? (
              <Animated.View style={[styles.loadingButton, animatedStyle]}>
                <ActivityIndicator size="small" color="white" />
              </Animated.View>
            ) : (
              <TouchableOpacity
                onPress={doSubmit}
                style={styles.loginButton}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF7D3B', '#FF5500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  logo: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(48),
    color: '#FF6B00',
    marginBottom: verticalScale(16),
    letterSpacing: 1,
  },
  welcomeTitle: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(24),
    color: '#1A1A1A',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: Fonts.REGULAR,
    fontSize: scale(14),
    color: '#888888',
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
  formSection: {
    marginBottom: verticalScale(24),
  },
  inputWrapper: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontFamily: Fonts.SEMI_BOLD,
    fontSize: scale(14),
    color: '#333333',
    marginBottom: verticalScale(10),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: verticalScale(50),
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    paddingHorizontal: scale(16),
  },
  inputFocused: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFFAF6',
  },
  inputError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF8F8',
  },
  inputIcon: {
    height: scale(20),
    width: scale(20),
    marginRight: scale(14),
    tintColor: '#FF6B00',
  },
  input: {
    flex: 1,
    fontSize: scale(15),
    color: '#1A1A1A',
    fontFamily: Fonts.REGULAR,
  },
  eyeButton: {
    padding: scale(8),
    marginRight: -scale(8),
  },
  eyeIcon: {
    width: scale(20),
    height: scale(20),
    opacity: 0.5,
  },
  errorText: {
    color: '#FF4444',
    fontSize: scale(12),
    fontFamily: Fonts.REGULAR,
    marginTop: verticalScale(8),
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(28),
    marginTop: verticalScale(4),
  },
  forgotPasswordText: {
    fontFamily: Fonts.SEMI_BOLD,
    fontSize: scale(13),
    color: '#FF6B00',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    height: verticalScale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loadingButton: {
    height: verticalScale(48),
    borderRadius: 14,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  footerText: {
    fontSize: scale(14),
    fontFamily: Fonts.REGULAR,
    color: '#666666',
  },
  registerLink: {
    fontSize: scale(14),
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
});
