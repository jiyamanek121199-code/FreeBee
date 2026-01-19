import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import Fonts from '../Fonts';
import {
  createStaticNavigation,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;

const OnboardingData = [
  {
    key: '1',
    image: require('./Images/result_onbording1.png'),
    title: 'You name it, we get it',
    subtitle: 'We deliver everything related to food or groceries',
    gradient: ['#FF9A56', '#FF6B00'],
  },
  {
    key: '2',
    image: require('./Images/result_onbording2.png'),
    title: 'Taste the Best',
    subtitle:
      'Enjoy the taste of all meals you love in one place. We are experts!',
    gradient: ['#FF7B3D', '#E85A00'],
  },
  {
    key: '3',
    image: require('./Images/onbording3.png'),
    title: 'Fastest Delivery',
    subtitle: 'Enjoy lightning-fast delivery to your doorstep',
    gradient: ['#FF8C4B', '#D45500'],
  },
  {
    key: '4',
    image: require('./Images/onbording4_optimized.png'),
    title: 'Door-Step Delivery',
    subtitle: 'No worry to go out. Now every store at your door-step',
    gradient: ['#FF9D5C', '#C04B00'],
  },
];

const DotIndicator = ({ currentIndex, totalDots }) => {
  return (
    <View style={styles.dotContainer}>
      {Array.from({ length: totalDots }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const OnboardingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const animation = useSharedValue(0);
  const pageRef = useRef(null);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentPage < OnboardingData.length - 1) {
      pageRef.current?.setPage(currentPage + 1);
    } else {
      setIsLoading(true);
      animation.value = withTiming(1, { duration: 600 }, () => {
        runOnJS(setIsLoading)(false);
        runOnJS(navigation.replace)('Login');
      });
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value === 0
          ? withTiming(BUTTON_WIDTH, { duration: 300 })
          : withTiming(60, { duration: 300 }),
      backgroundColor: animation.value === 0 ? '#FF6B00' : '#FFB380',
    };
  });

  const renderPage = (item, index) => (
    <View key={item.key} style={styles.pageContainer}>
      <View style={styles.imageWrapper}>
        <View style={styles.imageBackground}>
          <Image
            style={[styles.image, index >= 2 && styles.largeImage]}
            source={item.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF8" />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Page Indicator at Top */}
      <View style={styles.topIndicator}>
        <Text style={styles.pageNumber}>
          {currentPage + 1}
          <Text style={styles.pageTotal}>/{OnboardingData.length}</Text>
        </Text>
      </View>

      {/* Pager View */}
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pageRef}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
      >
        {OnboardingData.map((item, index) => renderPage(item, index))}
      </PagerView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <DotIndicator
          currentIndex={currentPage}
          totalDots={OnboardingData.length}
        />

        {isLoading ? (
          <Animated.View style={[styles.loadingButton, animatedButtonStyle]}>
            <ActivityIndicator size="small" color="white" />
          </Animated.View>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF7D3B', '#FF5500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {currentPage === OnboardingData.length - 1
                  ? "Let's Start"
                  : 'Next'}
              </Text>
              {currentPage < OnboardingData.length - 1 && (
                <Text style={styles.arrowIcon}>→</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF8',
  },
  skipButton: {
    position: 'absolute',
    top: verticalScale(50),
    right: scale(24),
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontFamily: Fonts.SEMI_BOLD,
    fontSize: scale(14),
    color: '#888888',
  },
  topIndicator: {
    position: 'absolute',
    top: verticalScale(50),
    left: scale(24),
    zIndex: 10,
  },
  pageNumber: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(16),
    color: '#FF6B00',
  },
  pageTotal: {
    fontFamily: Fonts.REGULAR,
    fontSize: scale(14),
    color: '#CCCCCC',
  },
  pagerView: {
    flex: 1,
    marginTop: verticalScale(100),
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: scale(24),
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageBackground: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  largeImage: {
    width: width * 0.8,
    height: width * 0.8,
  },
  contentContainer: {
    paddingBottom: verticalScale(140),
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.BOLD,
    fontSize: scale(24),
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: verticalScale(12),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: Fonts.REGULAR,
    fontSize: scale(15),
    color: '#666666',
    textAlign: 'center',
    lineHeight: scale(22),
    paddingHorizontal: scale(20),
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(24),
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(28),
    gap: 10,
  },
  dot: {
    borderRadius: 100,
  },
  activeDot: {
    width: 32,
    height: 10,
    backgroundColor: '#FF6B00',
    borderRadius: 5,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    backgroundColor: '#E0E0E0',
  },
  nextButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  gradientButton: {
    height: verticalScale(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: scale(17),
    fontFamily: Fonts.BOLD,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: scale(18),
    color: '#FFFFFF',
    fontFamily: Fonts.BOLD,
  },
  loadingButton: {
    height: verticalScale(48),
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
