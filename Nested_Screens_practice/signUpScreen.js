import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../Fonts';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [Email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const emailRef = useRef();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  function navigateToLogin() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  function isValidEmail(text) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(text);
  }

  async function doSubmit() {
    setPasswordError('');
    setUserNameError('');
    setEmailError('');
    setConfirmPasswordError('');
    var isValid = true;

    if (!userName) {
      setUserNameError('Please enter your username');
      isValid = false;
    }

    if (!Email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!isValidEmail(Email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);

      try {
        // Get existing users from AsyncStorage
        const existingUsersData = await AsyncStorage.getItem('UsersDetails');
        let usersArray = existingUsersData ? JSON.parse(existingUsersData) : [];

        // Check if email already exists
        const emailExists = usersArray.some(
          user => user.email.toLowerCase() === Email.toLowerCase(),
        );
        if (emailExists) {
          setIsLoading(false);
          setEmailError('This email is already registered');
          return;
        }

        // Check if username already exists
        const usernameExists = usersArray.some(
          user => user.username.toLowerCase() === userName.toLowerCase(),
        );
        if (usernameExists) {
          setIsLoading(false);
          setUserNameError('This username is already taken');
          return;
        }

        // Create new user data
        const newUser = {
          id: Date.now().toString(),
          username: userName,
          email: Email,
          password: password,
          createdAt: new Date().toISOString(),
        };

        // Add new user to array
        usersArray.push(newUser);

        // Save updated users array
        await AsyncStorage.setItem('UsersDetails', JSON.stringify(usersArray));

        setTimeout(() => {
          setIsLoading(false);
          Alert.alert(
            'Success!',
            'Your account has been created successfully.',
            [{ text: 'Continue to Login', onPress: navigateToLogin }],
          );
          setPassword('');
          setUserName('');
          setConfirmPassword('');
          setEmail('');
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to save account. Please try again.');
      }
    }
  }

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
          {/* Back Button */}
          <TouchableOpacity
            onPress={navigateToLogin}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image
              style={styles.backIcon}
              source={require('./Images/icons8-back-100.png')}
            />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.logo}>FreeBee</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to start ordering delicious food
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
                  placeholder="Choose a username"
                  onChangeText={text => {
                    setUserName(text);
                    setUserNameError('');
                  }}
                  value={userName}
                  placeholderTextColor="#B0B0B0"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current.focus()}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {userNameError ? (
                <Text style={styles.errorText}>{userNameError}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'email' && styles.inputFocused,
                  emailError && styles.inputError,
                ]}
              >
                <Image
                  style={styles.inputIcon}
                  source={require('./Images/icons8-email-60.png')}
                />
                <TextInput
                  style={styles.input}
                  ref={emailRef}
                  placeholder="Enter your email"
                  onChangeText={text => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  value={Email}
                  placeholderTextColor="#B0B0B0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current.focus()}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
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
                  placeholder="Create a password"
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  value={password}
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry={!isPasswordVisible}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current.focus()}
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

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'confirmPassword' && styles.inputFocused,
                  confirmPasswordError && styles.inputError,
                ]}
              >
                <Image
                  style={styles.inputIcon}
                  source={require('./Images/icons8-shield-20.png')}
                />
                <TextInput
                  style={styles.input}
                  ref={confirmPasswordRef}
                  placeholder="Confirm your password"
                  onChangeText={text => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                  }}
                  value={confirmPassword}
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry={!isPasswordVisible}
                  returnKeyType="done"
                  onSubmitEditing={doSubmit}
                  onFocus={() => setFocusedInput('confirmPassword')}
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
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            {/* Signup Button */}
            {isLoading ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={doSubmit}
                style={styles.signupButton}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF7D3B', '#FF5500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#333333',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  logo: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(38),
    color: '#FF6B00',
    marginBottom: verticalScale(8),
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(22),
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.REGULAR,
    fontSize: scale(13),
    color: '#888888',
    textAlign: 'center',
    marginTop: verticalScale(6),
  },
  formSection: {
    marginBottom: verticalScale(16),
  },
  inputWrapper: {
    marginBottom: verticalScale(16),
  },
  inputLabel: {
    fontFamily: Fonts.SEMI_BOLD,
    fontSize: scale(13),
    color: '#333333',
    marginBottom: verticalScale(8),
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
    fontSize: scale(14),
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
    fontSize: scale(11),
    fontFamily: Fonts.REGULAR,
    marginTop: verticalScale(6),
  },
  signupButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: verticalScale(8),
  },
  gradientButton: {
    height: verticalScale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
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
    marginTop: verticalScale(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  footerText: {
    fontSize: scale(14),
    fontFamily: Fonts.REGULAR,
    color: '#666666',
  },
  loginLink: {
    fontSize: scale(14),
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
});
