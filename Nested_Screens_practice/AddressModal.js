import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fonts from '../Fonts';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddressModal = ({
  visible,
  onClose,
  onAddressSelect,
  selectedAddressId,
}) => {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addressType, setAddressType] = useState('home');
  const [customLabel, setCustomLabel] = useState('');
  const [addressText, setAddressText] = useState('');

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData) {
        const parsed = JSON.parse(userData);
        setAddresses(parsed.addresses || []);
      }
    } catch (error) {
      console.log('Error loading addresses:', error);
    }
  };

  // Save addresses to AsyncStorage
  const saveAddresses = async newAddresses => {
    try {
      const userData = await AsyncStorage.getItem('User');
      const parsed = userData ? JSON.parse(userData) : {};
      parsed.addresses = newAddresses;
      await AsyncStorage.setItem('User', JSON.stringify(parsed));
    } catch (error) {
      console.log('Error saving addresses:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      loadAddresses();
      setIsAdding(false);
    }
  }, [visible]);

  const handleAddAddress = async () => {
    if (!addressText.trim()) return;

    const label =
      addressType === 'other' && customLabel.trim()
        ? customLabel.trim()
        : addressType === 'home'
        ? 'Home'
        : addressType === 'work'
        ? 'Work'
        : 'Other';

    const newAddress = {
      id: Date.now().toString(),
      type: addressType,
      label: label,
      address: addressText.trim(),
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);

    // Reset form
    setAddressType('home');
    setCustomLabel('');
    setAddressText('');
    setIsAdding(false);

    // Select the new address if it's the first one
    if (newAddress.isDefault) {
      onAddressSelect(newAddress);
    }
  };

  const handleSelectAddress = async address => {
    // Update isDefault for all addresses
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === address.id,
    }));
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
    onAddressSelect(address);
    onClose();
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      default:
        return '📍';
    }
  };

  const renderAddressList = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dragHandle} />
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Address List */}
      <ScrollView
        style={styles.addressList}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>No addresses saved yet</Text>
            <Text style={styles.emptySubText}>
              Add your first delivery address
            </Text>
          </View>
        ) : (
          addresses.map(address => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressItem,
                selectedAddressId === address.id && styles.addressItemSelected,
              ]}
              onPress={() => handleSelectAddress(address)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedAddressId === address.id &&
                      styles.radioOuterSelected,
                  ]}
                >
                  {selectedAddressId === address.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <View style={styles.addressContent}>
                <View style={styles.addressLabelRow}>
                  <Text style={styles.addressIcon}>
                    {getTypeIcon(address.type)}
                  </Text>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAdding(true)}
      >
        <Text style={styles.addButtonIcon}>➕</Text>
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </>
  );

  const renderAddForm = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dragHandle} />
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => setIsAdding(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { flex: 1 }]}>Add New Address</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Type Selection */}
        <Text style={styles.formLabel}>Select Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeChip,
              addressType === 'home' && styles.typeChipSelected,
            ]}
            onPress={() => setAddressType('home')}
          >
            <Text style={styles.typeIcon}>🏠</Text>
            <Text
              style={[
                styles.typeText,
                addressType === 'home' && styles.typeTextSelected,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeChip,
              addressType === 'work' && styles.typeChipSelected,
            ]}
            onPress={() => setAddressType('work')}
          >
            <Text style={styles.typeIcon}>🏢</Text>
            <Text
              style={[
                styles.typeText,
                addressType === 'work' && styles.typeTextSelected,
              ]}
            >
              Work
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeChip,
              addressType === 'other' && styles.typeChipSelected,
            ]}
            onPress={() => setAddressType('other')}
          >
            <Text style={styles.typeIcon}>📍</Text>
            <Text
              style={[
                styles.typeText,
                addressType === 'other' && styles.typeTextSelected,
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Label (only for 'other' type) */}
        {addressType === 'other' && (
          <>
            <Text style={styles.formLabel}>Custom Label</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Gym, Office, etc."
              placeholderTextColor="#9a9a9a"
              value={customLabel}
              onChangeText={setCustomLabel}
            />
          </>
        )}

        {/* Address Input */}
        <Text style={styles.formLabel}>Full Address</Text>
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder="Enter your complete address..."
          placeholderTextColor="#9a9a9a"
          value={addressText}
          onChangeText={setAddressText}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !addressText.trim() && styles.saveButtonDisabled,
          ]}
          onPress={handleAddAddress}
          disabled={!addressText.trim()}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          {isAdding ? renderAddForm() : renderAddressList()}
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: scale(18),
    color: '#666',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: scale(20),
    color: '#FF6B00',
  },
  addressList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: scale(16),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    color: '#888',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  addressItemSelected: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FF6B00',
  },
  radioContainer: {
    marginRight: 12,
    paddingTop: 3,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FF6B00',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B00',
  },
  addressContent: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressLabel: {
    fontSize: scale(15),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
  },
  addressText: {
    fontSize: scale(13),
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 15,
  },
  addButtonIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  addButtonText: {
    fontSize: scale(15),
    fontFamily: Fonts.BOLD,
    color: '#ffffff',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formLabel: {
    fontSize: scale(14),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeChipSelected: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FF6B00',
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: scale(13),
    fontFamily: Fonts.MEDUIM,
    color: '#666',
  },
  typeTextSelected: {
    color: '#FF6B00',
    fontFamily: Fonts.BOLD,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  addressInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: scale(15),
    fontFamily: Fonts.BOLD,
    color: '#ffffff',
  },
});
