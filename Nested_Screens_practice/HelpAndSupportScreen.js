import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fonts2 from '../Fonts2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale } from 'react-native-size-matters';

const HelpAndSupportScreen = () => {
  const navigation = useNavigation();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer:
        'Browse restaurants, add items to your cart, and proceed to checkout. Select your delivery address and payment method to complete the order.',
    },
    {
      id: 2,
      question: 'How can I track my order?',
      answer:
        'Once your order is placed, you can track it in real-time from the Orders section in your account.',
    },
    {
      id: 3,
      question: 'What payment methods are accepted?',
      answer:
        'We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery.',
    },
    {
      id: 4,
      question: 'How do I cancel an order?',
      answer:
        'You can cancel your order before the restaurant starts preparing it. Go to Orders and tap on Cancel Order.',
    },
    {
      id: 5,
      question: 'How do I apply a coupon?',
      answer:
        'Go to your cart, tap on "Apply Coupon" and enter the coupon code or select from available offers.',
    },
  ];

  const contactOptions = [
    {
      id: 1,
      icon: 'email-outline',
      title: 'Email Us',
      subtitle: 'support@freebee.com',
      onPress: () => Linking.openURL('mailto:support@freebee.com'),
    },
    {
      id: 2,
      icon: 'phone-outline',
      title: 'Call Us',
      subtitle: '+91 1800-123-4567',
      onPress: () => Linking.openURL('tel:18001234567'),
    },
    {
      id: 3,
      icon: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      onPress: () => Linking.openURL('https://wa.me/918001234567'),
    },
  ];

  const toggleFaq = id => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.contactItem}
              onPress={option.onPress}
            >
              <View style={styles.contactIcon}>
                <Icon name={option.icon} size={22} color="#FF6B00" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleFaq(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color="#666"
                />
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default HelpAndSupportScreen;

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
    paddingHorizontal: 16,
  },
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
    marginBottom: 16,
  },
  // Contact Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },
  contactTitle: {
    fontSize: scale(15),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
  },
  contactSubtitle: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 2,
  },
  // FAQ Styles
  faqItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: scale(14),
    fontFamily: Fonts2.SEMI_BOLD,
    color: '#1a1a1a',
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: scale(13),
    fontFamily: Fonts2.MEDUIM,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
});
