import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import Fonts from '../Fonts';
import Fonts2 from '../Fonts2';
import { androidCameraPermission } from '../permissions';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verticalScale, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddressModal from './AddressModal';
import Modall from './Modal';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Modal states
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [giftCardModalVisible, setGiftCardModalVisible] = useState(false);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.username || '');
        setUserEmail(user.email || '');
        setProfileImage(user.profileImage || null);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveProfileImage = async imagePath => {
    try {
      const userData = await AsyncStorage.getItem('User');
      const user = userData ? JSON.parse(userData) : {};
      user.profileImage = imagePath;
      await AsyncStorage.setItem('User', JSON.stringify(user));
      setProfileImage(imagePath);
    } catch (error) {
      console.log('Error saving profile image:', error);
    }
  };

  const onSelectImage = async () => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS === 'android') {
      Alert.alert('Upload Picture', 'Choose an option', [
        { text: 'Camera', onPress: onCamera },
        { text: 'Gallery', onPress: onGallery },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      saveProfileImage(image.path);
    });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      saveProfileImage(image.path);
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('isLoggedIn');
          navigation.replace('Auth', { screen: 'Login' });
        },
      },
    ]);
  };

  const resetPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const user = JSON.parse(userData);

        // Check current password
        if (user.password !== currentPassword) {
          Alert.alert('Error', 'Current password is incorrect');
          return;
        }

        // Update password
        user.password = newPassword;
        await AsyncStorage.setItem('User', JSON.stringify(user));

        // Also update in UsersDetails array
        const usersData = await AsyncStorage.getItem('UsersDetails');
        if (usersData) {
          const users = JSON.parse(usersData);
          const userIndex = users.findIndex(u => u.email === user.email);
          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            await AsyncStorage.setItem('UsersDetails', JSON.stringify(users));
          }
        }

        Alert.alert('Success', 'Password changed successfully!');
        setPasswordModalVisible(false);
        resetPasswordFields();
      }
    } catch (error) {
      console.log('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showBadge,
    badgeText,
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <Icon name={icon} size={22} color="#FF6B00" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
      <Icon name="chevron-right" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  const SectionCard = ({ title, children }) => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('./Images/icon_dummy_icon.png')
              }
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={onSelectImage}
              activeOpacity={0.8}
            >
              <Icon name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userName || 'User Name'}</Text>
          <Text style={styles.userEmail}>{userEmail || 'user@email.com'}</Text>

          {/* <TouchableOpacity style={styles.editProfileButton}>
            <Icon name="pencil" size={16} color="#FF6B00" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity> */}
        </View>

        {/* Account Section */}
        <SectionCard title="Account">
          {/* <MenuItem
            icon="store"
            title="My Store"
            subtitle="Manage your store settings"
            onPress={() => {}}
          /> */}
          <MenuItem
            icon="map-marker"
            title="Delivery Addresses"
            subtitle="Manage saved addresses"
            onPress={() => setAddressModalVisible(true)}
          />
          <MenuItem
            icon="credit-card"
            title="Payment Methods"
            subtitle="Cards and UPI"
            onPress={() => navigation.navigate('PaymentMethods')}
          />
        </SectionCard>

        {/* Rewards Section */}
        <SectionCard title="Rewards & Offers">
          <MenuItem
            icon="gift"
            title="Gift Cards"
            subtitle="Buy or redeem gift cards"
            onPress={() => setGiftCardModalVisible(true)}
          />
          <MenuItem
            icon="ticket-percent"
            title="My Coupons"
            subtitle="View available offers"
            showBadge={true}
            badgeText="5 New"
            onPress={() => setCouponModalVisible(true)}
          />
          {/* <MenuItem
            icon="star-circle"
            title="Rewards Points"
            subtitle="Earn & redeem points"
            onPress={() => {}}
          /> */}
        </SectionCard>

        {/* Support Section */}
        <SectionCard title="Support & Settings">
          <MenuItem
            icon="lock-reset"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => {
              resetPasswordFields();
              setPasswordModalVisible(true);
            }}
          />
          {/* <MenuItem
            icon="bell-outline"
            title="Notifications"
            subtitle="Manage notifications"
            onPress={() => {}}
          /> */}
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs and contact us"
            onPress={() => navigation.navigate('HelpAndSupport')}
          />
          <MenuItem
            icon="information-outline"
            title="About"
            subtitle="App version 1.0.0"
            onPress={() => navigation.navigate('About')}
          />
        </SectionCard>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={22} color="#FF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>FreeBee v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ in India</Text>
        </View> */}
      </ScrollView>

      {/* Address Modal */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onAddressSelect={() => setAddressModalVisible(false)}
      />

      {/* Coupon Modal */}
      <Modall
        modalVisible={couponModalVisible}
        setModalVisible={setCouponModalVisible}
        subTotal={0}
      />

      {/* Gift Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={giftCardModalVisible}
        onRequestClose={() => setGiftCardModalVisible(false)}
      >
        <View style={styles.giftModalOverlay}>
          <Pressable
            style={styles.giftModalBackdrop}
            onPress={() => setGiftCardModalVisible(false)}
          />
          <View style={styles.giftModalContainer}>
            <View style={styles.giftModalHandle} />
            <View style={styles.giftModalHeader}>
              <Icon name="gift" size={28} color="#FF6B00" />
              <Text style={styles.giftModalTitle}>Gift Cards</Text>
              <TouchableOpacity
                style={styles.giftModalClose}
                onPress={() => setGiftCardModalVisible(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.giftModalContent}>
              <View style={styles.giftEmptyIcon}>
                <Icon name="gift-off-outline" size={60} color="#ccc" />
              </View>
              <Text style={styles.giftEmptyTitle}>No Gift Cards</Text>
              <Text style={styles.giftEmptySubtitle}>
                You don't have any gift cards yet. Buy or redeem a gift card to
                see it here.
              </Text>
              {/* <TouchableOpacity style={styles.giftBuyButton}>
                <Icon name="plus" size={20} color="#fff" />
                <Text style={styles.giftBuyButtonText}>Buy Gift Card</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => {
          setPasswordModalVisible(false);
          resetPasswordFields();
        }}
      >
        <View style={styles.giftModalOverlay}>
          <Pressable
            style={styles.giftModalBackdrop}
            onPress={() => {
              setPasswordModalVisible(false);
              resetPasswordFields();
            }}
          />
          <View style={styles.passwordModalContainer}>
            <View style={styles.giftModalHandle} />
            <View style={styles.giftModalHeader}>
              <Icon name="lock-reset" size={28} color="#FF6B00" />
              <Text style={styles.giftModalTitle}>Change Password</Text>
              <TouchableOpacity
                style={styles.giftModalClose}
                onPress={() => {
                  setPasswordModalVisible(false);
                  resetPasswordFields();
                }}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.passwordModalContent}>
              {/* Current Password */}
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter current password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Icon
                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Icon
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* Change Password Button */}
              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={handleChangePassword}
              >
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.changePasswordButtonText}>
                  Update Password
                </Text>
              </TouchableOpacity>

              <View style={styles.passwordNote}>
                <Icon name="information-outline" size={16} color="#666" />
                <Text style={styles.passwordNoteText}>
                  Password must be at least 6 characters long
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(5),
    backgroundColor: '#FAFAFA',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#eee',
  },
  editButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: scale(22),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginBottom: 12,
  },
  // Section Card
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  // Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: scale(15),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  menuSubtitle: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    fontSize: scale(10),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  logoutText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#FF4444',
    marginLeft: 10,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
  },
  footerSubtext: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#ccc',
    marginTop: 4,
  },
  // Gift Card Modal Styles
  giftModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  giftModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  giftModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 30,
  },
  giftModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  giftModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  giftModalTitle: {
    flex: 1,
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  giftModalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftModalContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  giftEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  giftEmptyTitle: {
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  giftEmptySubtitle: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  giftBuyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  giftBuyButtonText: {
    fontSize: scale(15),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
    marginLeft: 8,
  },
  // Password Modal Styles
  passwordModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
  },
  passwordModalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  passwordInput: {
    flex: 1,
    fontSize: scale(15),
    fontFamily: Fonts2.MEDUIM,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
  },
  changePasswordButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
    marginLeft: 8,
  },
  passwordNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  passwordNoteText: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginLeft: 6,
  },
});
