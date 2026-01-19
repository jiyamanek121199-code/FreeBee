import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Fonts from '../Fonts';
import { scale, verticalScale } from 'react-native-size-matters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductDetailModal = ({ visible, onClose, product, onAddToCart }) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image source={product.image} style={styles.productImage} />
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.productName}>{product.name}</Text>

              {/* Rating */}
              <Image source={product.rating} style={styles.ratingImage} />

              {/* Price and Unit */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>{product.prices}</Text>
                {product.unit && (
                  <Text style={styles.unit}>/{product.unit}</Text>
                )}
              </View>

              {/* Details Section */}
              {product.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {product.description}
                  </Text>
                </View>
              )}

              {/* Freshness/Quality */}
              {product.freshness && (
                <View style={styles.badgeContainer}>
                  <View style={styles.freshnessBadge}>
                    <Text style={styles.badgeIcon}>🌿</Text>
                    <Text style={styles.badgeText}>{product.freshness}</Text>
                  </View>
                </View>
              )}

              {/* Additional Info */}
              {product.details && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Product Details</Text>
                  {product.details.map((detail, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{detail.label}</Text>
                      <Text style={styles.detailValue}>{detail.value}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Benefits */}
              {product.benefits && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  {product.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Add to Cart Button */}
          <View style={styles.bottomContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.bottomPrice}>{product.prices}</Text>
              {product.unit && (
                <Text style={styles.bottomUnit}>/{product.unit}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                onAddToCart(product);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductDetailModal;

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
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: scale(18),
    color: '#666',
  },
  content: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: verticalScale(180),
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  productImage: {
    height: verticalScale(140),
    width: scale(140),
    resizeMode: 'contain',
  },
  infoContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  productName: {
    fontSize: scale(24),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  ratingImage: {
    height: verticalScale(18),
    width: scale(100),
    resizeMode: 'contain',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: scale(28),
    fontFamily: Fonts.BOLD,
    color: '#FF6B00',
  },
  unit: {
    fontSize: scale(16),
    fontFamily: Fonts.MEDUIM,
    color: '#888',
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    lineHeight: 22,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  freshnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  badgeText: {
    fontSize: scale(13),
    fontFamily: Fonts.MEDUIM,
    color: '#2E7D32',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    color: '#888',
  },
  detailValue: {
    fontSize: scale(14),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: scale(16),
    color: '#FF6B00',
    marginRight: 10,
    lineHeight: 22,
  },
  benefitText: {
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    color: '#666',
    flex: 1,
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomPrice: {
    fontSize: scale(22),
    fontFamily: Fonts.BOLD,
    color: '#1a1a1a',
  },
  bottomUnit: {
    fontSize: scale(14),
    fontFamily: Fonts.MEDUIM,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: scale(15),
    fontFamily: Fonts.BOLD,
    color: '#fff',
  },
});
