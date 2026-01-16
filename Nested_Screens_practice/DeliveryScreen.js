import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from './CartContext';
import Fonts2 from '../Fonts2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

const DeliveryScreen = () => {
  const navigation = useNavigation();
  const { activeOrder, clearActiveOrder } = useContext(CartContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);

  const deliverySteps = [
    {
      id: 0,
      icon: 'clipboard-check-outline',
      title: 'Order Confirmed',
      subtitle: 'Your order has been received',
    },
    {
      id: 1,
      icon: 'chef-hat',
      title: 'Preparing Order',
      subtitle: 'Chef is cooking your food',
    },
    {
      id: 2,
      icon: 'package-variant',
      title: 'Order Packed',
      subtitle: 'Your order is ready for pickup',
    },
    {
      id: 3,
      icon: 'motorbike',
      title: 'Out for Delivery',
      subtitle: 'Rider is on the way',
    },
    {
      id: 4,
      icon: 'home-outline',
      title: 'Delivered',
      subtitle: 'Enjoy your meal!',
    },
  ];

  // Simulate order progress
  useEffect(() => {
    if (activeOrder) {
      const orderTime = new Date(activeOrder.placedAt).getTime();
      const deliveryMins = activeOrder.estimatedDelivery || 30;

      const updateProgress = () => {
        const now = Date.now();
        const elapsed = (now - orderTime) / 60000; // minutes elapsed
        const remaining = Math.max(0, deliveryMins - elapsed);
        setRemainingTime(Math.ceil(remaining));

        // Update step based on elapsed time
        const progress = elapsed / deliveryMins;
        if (progress < 0.1) setCurrentStep(0);
        else if (progress < 0.3) setCurrentStep(1);
        else if (progress < 0.5) setCurrentStep(2);
        else if (progress < 0.9) setCurrentStep(3);
        else setCurrentStep(4);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  const handleDismiss = () => {
    clearActiveOrder();
    navigation.goBack();
  };

  if (!activeOrder) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Status</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="package-variant-closed" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Active Order</Text>
          <Text style={styles.emptySubtitle}>
            You don't have any ongoing orders
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Status</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Animation */}
        <View style={styles.animationContainer}>
          <View style={styles.deliveryIconBig}>
            <Icon
              name={deliverySteps[currentStep].icon}
              size={60}
              color="#FF6B00"
            />
          </View>
          <Text style={styles.statusTitle}>
            {deliverySteps[currentStep].title}
          </Text>
          <Text style={styles.statusSubtitle}>
            {deliverySteps[currentStep].subtitle}
          </Text>
        </View>

        {/* Time Estimate */}
        <View style={styles.timeCard}>
          <View style={styles.timeIconContainer}>
            <Icon name="clock-outline" size={24} color="#FF6B00" />
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Estimated Delivery</Text>
            <Text style={styles.timeValue}>
              {remainingTime > 0 ? `${remainingTime} minutes` : 'Arriving now!'}
            </Text>
          </View>
        </View>

        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Order Progress</Text>

          {deliverySteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              {/* Step Line */}
              {index < deliverySteps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < currentStep && styles.stepLineActive,
                  ]}
                />
              )}

              {/* Step Icon */}
              <View
                style={[
                  styles.stepIconContainer,
                  index <= currentStep && styles.stepIconActive,
                  index === currentStep && styles.stepIconCurrent,
                ]}
              >
                {index < currentStep ? (
                  <Icon name="check" size={18} color="#fff" />
                ) : (
                  <Icon
                    name={step.icon}
                    size={18}
                    color={index <= currentStep ? '#fff' : '#999'}
                  />
                )}
              </View>

              {/* Step Text */}
              <View style={styles.stepTextContainer}>
                <Text
                  style={[
                    styles.stepTitle,
                    index <= currentStep && styles.stepTitleActive,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Details */}
        <View style={styles.orderDetailsCard}>
          <Text style={styles.orderDetailsTitle}>Order Details</Text>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order ID</Text>
            <Text style={styles.orderDetailValue}>
              #{activeOrder.id.slice(-6)}
            </Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Items</Text>
            <Text style={styles.orderDetailValue}>
              {activeOrder.items?.length || 0} items
            </Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Placed At</Text>
            <Text style={styles.orderDetailValue}>
              {new Date(activeOrder.placedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Dismiss Button */}
        {currentStep >= 4 && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
          >
            <Icon name="check-circle" size={22} color="#fff" />
            <Text style={styles.dismissButtonText}>Order Received</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(15),
    paddingBottom: 10,
  },
  backButton: {
    height: 44,
    width: 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: scale(20),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 8,
  },
  // Animation Container
  animationContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  deliveryIconBig: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: scale(22),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
  },
  statusSubtitle: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 6,
  },
  // Time Card
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInfo: {
    marginLeft: 14,
  },
  timeLabel: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  timeValue: {
    fontSize: scale(18),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginTop: 2,
  },
  // Steps Container
  stepsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stepsTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    left: 17,
    top: 38,
    width: 2,
    height: 40,
    backgroundColor: '#eee',
  },
  stepLineActive: {
    backgroundColor: '#FF6B00',
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepIconActive: {
    backgroundColor: '#FF6B00',
  },
  stepIconCurrent: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#999',
  },
  stepTitleActive: {
    color: '#1a1a1a',
  },
  stepSubtitle: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#999',
    marginTop: 2,
  },
  // Order Details
  orderDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  orderDetailsTitle: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderDetailLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  orderDetailValue: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  // Dismiss Button
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#02B334',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
  },
  dismissButtonText: {
    fontSize: scale(16),
    fontFamily: Fonts2.BOLD,
    color: '#fff',
    marginLeft: 10,
  },
});
