import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fonts2 from '../Fonts2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale } from 'react-native-size-matters';

const AboutScreen = () => {
  const navigation = useNavigation();

  const features = [
    { icon: 'truck-fast', text: 'Fast Delivery' },
    { icon: 'food', text: 'Fresh Food' },
    { icon: 'shield-check', text: 'Safe & Secure' },
    { icon: 'percent', text: 'Best Offers' },
  ];

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
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./Images/icon_logo.png')}
              style={{ height: scale(60), width: scale(60) }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>FreeBee</Text>
          <Text style={styles.tagline}>
            Delivering happiness to your doorstep
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About FreeBee</Text>
          <Text style={styles.description}>
            FreeBee is your go-to food delivery app that brings delicious meals
            from your favorite restaurants straight to your doorstep. We partner
            with the best local restaurants and eateries to offer you a wide
            variety of cuisines, from traditional Indian dishes to international
            flavors.
          </Text>
          <Text style={styles.description}>
            Our mission is to make food ordering simple, fast, and enjoyable.
            With our easy-to-use app, you can explore menus, customize your
            orders, track deliveries in real-time, and enjoy great discounts
            with our exclusive offers and coupons.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Icon name={feature.icon} size={24} color="#FF6B00" />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developed By</Text>
            <Text style={styles.infoValue}>Jiya</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Technology</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>Android & iOS</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in India</Text>
          <Text style={styles.copyright}>
            © 2026 FreeBee. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

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
    paddingBottom: 30,
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: scale(28),
    fontFamily: Fonts2.BLACK,
    color: '#FF6B00',
  },
  tagline: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 4,
  },
  versionBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 12,
  },
  versionText: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  // Section Styles
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
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
  description: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: scale(13),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
  },
  infoValue: {
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: scale(14),
    fontFamily: Fonts2.MEDUIM,
    color: '#888',
  },
  copyright: {
    fontSize: scale(12),
    fontFamily: Fonts2.MEDUIM,
    color: '#aaa',
    marginTop: 6,
  },
});
