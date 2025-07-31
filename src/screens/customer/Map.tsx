import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  ImageBackground,
  TextInput,
  Vibration,
  FlatList,
  Linking,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
// import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import Carousel from 'react-native-snap-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  SharedValue,
  Easing,
  useAnimatedReaction,
  withSequence,
  useDerivedValue,
} from 'react-native-reanimated';

import { ShadowView } from 'react-native-inner-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';

/**
 * =============================================================================
 * TYPES AND INTERFACES
 * =============================================================================
 */
interface Card {
  id: number;
  title: string;
  rating: number;
  jobsDone: number;
  workers: number;
  image: string;
  businessCard: string;
}

interface Service {
  service_id: number;
  name: string;
  description: string;
  price_range: string;
  category_name: string;
  image: string | null;
  service_uuid?: string;
}

export interface Provider {
  service_uuid: string;
  service_name: string;
  service_description: string;
  price_range: string;
  category_name: string;
  category_description: string;
  ps_uuid: string;
  provider_service_price: string;
  provider_service_availability: string;
  provider_uuid: string;
  business_name: string;
  address: string;
  call_out_charges: string;
  verification_status: string;
  legal_documents: string;
  provider_description: string;
  contact_number: string;
  website: string;
  latitude?: number;
  longitude?: number;
  distance?: string;
}

interface ServiceResponse {
  data: Service[];
  total: number;
  totalPages: number;
  range: string;
}

// interface ProviderResponse {
//   data: Provider[];
//   total: number;
//   totalPages: number;
//   range: string;
// }

interface SearchSuggestionProps {
  service: Service;
  onSelect: (service: Service) => void;
}

interface ProviderCardItemProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
  isSelected: boolean;
}

interface ProviderCardProps {
  card: Card;
  isCurrent: boolean;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  gestureHandler: (event: PanGestureHandlerGestureEvent) => void;
  stackOffset: number;
  swipeDirection: SharedValue<number>;
  swipeProgress: SharedValue<number>;
}

interface CardContentProps {
  card: Card;
}

interface TourLocation {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'academic' | 'administrative' | 'recreational' | 'service';
  image: string;
  floor?: string;
  hours?: string;
  contact?: string;
  indoorMap?: string;
  tourPoints?: string[];
}

/**
 * =============================================================================
 * CONSTANTS & UTILITY FUNCTIONS
 * =============================================================================
 */
// const defaultImages = {
//   'Home Maintenance':
//     'https://img.freepik.com/free-vector/bathroom-interior-realistic-composition_1284-65677.jpg',
//   'Health & Wellness':
//     'https://img.freepik.com/free-vector/physiotherapy-isometric-composition_1284-24521.jpg',
//   'Education & Tutoring':
//     'https://img.freepik.com/free-vector/online-tutorials-concept_23-2148688910.jpg',
//   'Event Management':
//     'https://img.freepik.com/free-vector/event-management-illustration_23-2148907053.jpg',
//   Transportation:
//     'https://img.freepik.com/free-vector/taxi-service-abstract-concept_335657-3058.jpg',
//   default:
//     'https://img.freepik.com/free-vector/service-concept-illustration_114360-434.jpg',
// };

const defaultBusinessCards = {
  'Home Maintenance':
    'https://img.freepik.com/free-vector/plumbing-service-business-card-template_23-2149000913.jpg',
  'Health & Wellness':
    'https://img.freepik.com/free-vector/physiotherapy-business-card-template_23-2149000915.jpg',
  'Education & Tutoring':
    'https://img.freepik.com/free-vector/education-business-card-template_23-2149000916.jpg',
  'Event Management':
    'https://img.freepik.com/free-vector/event-management-business-card-template_23-2149000917.jpg',
  Transportation:
    'https://img.freepik.com/free-vector/taxi-business-card-template_23-2149000918.jpg',
  default:
    'https://img.freepik.com/free-vector/business-card-template_23-2149000919.jpg',
};

const providerLogos = {
  Plumbing:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Sq7qP5Hc6764MGKM3IaRUbB4EoKFoJ.png',
  Mechanic:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lqfbMXqo2FyMWZRbF8ePaMcfyEbrP1.png',
  Electrician:
    'https://img.freepik.com/free-vector/electrician-logo-template_23-2149000913.jpg',
  Nanny:
    'https://img.freepik.com/free-vector/nanny-logo-template_23-2149000914.jpg',
  default:
    'https://img.freepik.com/free-vector/business-logo-template_23-2149000919.jpg',
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE_FACTOR = SCREEN_WIDTH / 428;
const scaleSize = (size: number): number => {
  'worklet';
  return size * SCALE_FACTOR;
};

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const RETURN_SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const API_BASE_URL = 'https://podiumapp.site/server/services';

/**
 * Utility: Trigger haptic feedback
 */
const triggerHapticFeedback = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(10);
  } else {
    Vibration.vibrate(20);
  }
};

/**
 * Utility: Convert Service to Card format
 */
// const serviceToCard = (service: Service): Card => {
//   const categoryImage =
//     service.image ||
//     defaultImages[service.category_name as keyof typeof defaultImages] ||
//     defaultImages.default;
//   const businessCardImage =
//     defaultBusinessCards[
//       service.category_name as keyof typeof defaultBusinessCards
//     ] || defaultBusinessCards.default;
//   const seed = service.service_id;
//   const rating = 3.5 + (seed % 15) / 10;
//   const jobsDone = 100 + ((seed * 37) % 900);
//   const workers = 5 + ((seed * 13) % 45);
//   return {
//     id: service.service_id,
//     title: service.name,
//     rating: parseFloat(rating.toFixed(1)),
//     jobsDone,
//     workers,
//     image: categoryImage,
//     businessCard: businessCardImage,
//   };
// };

/**
 * Utility: Generate random coordinates and distance for providers
 */
const generateRandomCoordinates = (index: number) => {
  const centerLat = 37.7749;
  const centerLng = -122.4194;
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;
  const lat = centerLat + latOffset + index * 0.01;
  const lng = centerLng + lngOffset - index * 0.01;
  const distance = Math.sqrt(
    Math.pow(latOffset * 111, 2) + Math.pow(lngOffset * 111, 2),
  ).toFixed(1);
  return { latitude: lat, longitude: lng, distance: `${distance} km` };
};

/**
 * Utility: Enhance provider data with coordinates and distance
 */
const enhanceProviders = (providers: Provider[]): Provider[] => {
  return providers.map((provider, index) => {
    const coordinates = generateRandomCoordinates(index);
    return {
      ...provider,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      distance: coordinates.distance,
    };
  });
};

/**
 * Utility: Get provider logo based on business name
 */
const getProviderLogo = (businessName: string): string => {
  if (businessName.toLowerCase().includes('plumbing')) {
    return providerLogos.Plumbing;
  } else if (businessName.toLowerCase().includes('mechanic')) {
    return providerLogos.Mechanic;
  } else if (businessName.toLowerCase().includes('electrician')) {
    return providerLogos.Electrician;
  } else if (businessName.toLowerCase().includes('nanny')) {
    return providerLogos.Nanny;
  } else {
    return providerLogos.default;
  }
};

/**
 * Utility: Get icon name based on category
 */
const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Home Maintenance':
      return 'hammer';
    case 'Health & Wellness':
      return 'fitness';
    case 'Education & Tutoring':
      return 'school';
    case 'Event Management':
      return 'calendar';
    case 'Transportation':
      return 'car';
    default:
      return 'briefcase';
  }
};

/**
 * =============================================================================
 * SUB-COMPONENTS
 * =============================================================================
 */

/**
 * SearchSuggestion Component
 */
const SearchSuggestion: React.FC<SearchSuggestionProps> = React.memo(
  ({ service, onSelect }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onSelect(service)}
    >
      <View style={styles.suggestionContent}>
        <View style={styles.suggestionIconContainer}>
          <Ionicons
            name={getCategoryIcon(service.category_name)}
            size={scaleSize(20)}
            color="#01848F"
          />
        </View>
        <View style={styles.suggestionTextContainer}>
          <Text style={styles.suggestionTitle}>{service.name}</Text>
          <Text style={styles.suggestionCategory}>{service.category_name}</Text>
        </View>
        <Text style={styles.suggestionPrice}>{service.price_range}</Text>
      </View>
    </TouchableOpacity>
  ),
);

/**
 * ProviderCardItem Component for Carousel
 */
const ProviderCardItem: React.FC<ProviderCardItemProps> = React.memo(
  ({ provider, onSelect, isSelected }) => (
    <TouchableOpacity
      style={[styles.providerCard, isSelected && styles.selectedProviderCard]}
      onPress={() => onSelect(provider)}
      activeOpacity={0.9}
    >
      <ShadowView
        inset
        backgroundColor="#fefefe"
        shadowColor="#A4A1A066"
        shadowOffset={{ width: 1, height: 1 }}
        shadowBlur={4}
        style={styles.providerCardContent}
      >
        {/* <View style={styles.providerCardContent}> */}
        <Image
          source={{ uri: getProviderLogo(provider.business_name) }}
          style={styles.providerImage}
          resizeMode="cover"
        />
        <Text style={styles.providerName}>{provider.business_name}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{provider.distance}</Text>
        </View>
        <Text style={styles.providerDescription} numberOfLines={2}>
          {provider.provider_description ||
            provider.service_description ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
        </Text>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() => onSelect(provider)}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={scaleSize(18)} color="#FFFFFF" />
        </TouchableOpacity>
        {/* </View> */}
      </ShadowView>
    </TouchableOpacity>
  ),
);

/**
 * CardContent Component
 */
const CardContent: React.FC<CardContentProps> = React.memo(({ card }) => (
  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>{card.title}</Text>
    <View style={styles.ratingBadge}>
      <Ionicons name="star" size={scaleSize(18)} color="#FFD700" />
      <Text style={styles.ratingText}>{card.rating}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="call" size={scaleSize(25)} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="chatbubble" size={scaleSize(25)} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="log-out" size={scaleSize(25)} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="location" size={scaleSize(25)} color="#fff" />
      </TouchableOpacity>
    </View>
    <View style={styles.statsContainer}>
      <View style={styles.statsLeftContainer}>
        <View style={styles.workersStat}>
          <Text style={styles.statsNumberLarge}>{card.workers}+</Text>
          <Text style={styles.statsLabel}>Workers</Text>
        </View>
        <View style={styles.jobsDoneStat}>
          <Text style={styles.statsNumberXLarge}>{card.jobsDone}+</Text>
          <Text style={styles.statsLabel}>Jobs Done</Text>
        </View>
      </View>
      <View style={styles.businessCard}>
        <Image
          source={{ uri: card.businessCard }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
    </View>
    <ImageBackground
      source={{ uri: card.image }}
      style={styles.cardBackground}
      imageStyle={styles.cardBackgroundImage}
    >
      <Text style={styles.statsLabel}>Jobs Done</Text>
    </ImageBackground>
  </View>
));

/**
 * ProviderCard Component (swipeable card)
 */
const ProviderCard: React.FC<ProviderCardProps> = React.memo(
  ({
    card,
    isCurrent,
    translateX,
    translateY,
    gestureHandler,
    stackOffset,
    swipeDirection,
    swipeProgress,
  }) => {
    const cardScale = useSharedValue(isCurrent ? 1 : 0.95 - stackOffset * 0.01);
    const opacity = useSharedValue(isCurrent ? 1 : 0.9 - stackOffset * 0.05);

    const leftIndicatorOpacity = useDerivedValue(() => {
      if (!isCurrent) {
        return 0;
      }
      return swipeDirection.value === -1
        ? Math.min(Math.abs(swipeProgress.value) * 1.5, 1)
        : 0;
    });

    const rightIndicatorOpacity = useDerivedValue(() => {
      if (!isCurrent) {
        return 0;
      }
      return swipeDirection.value === 1
        ? Math.min(Math.abs(swipeProgress.value) * 1.5, 1)
        : 0;
    });

    useAnimatedReaction(
      () => swipeDirection.value,
      (currentValue, previousValue) => {
        if (!isCurrent && currentValue !== 0 && previousValue === 0) {
          cardScale.value = withSequence(
            withTiming(0.98, { duration: 100 }),
            withTiming(1, { duration: 200 }),
          );
          opacity.value = withTiming(1, TIMING_CONFIG);
        }
      },
      [isCurrent],
    );

    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      if (isCurrent) {
        const rotation = `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          [-12, 0, 12],
          'clamp',
        )}deg`;
        const verticalAdjustment = Math.abs(translateX.value) * 0.12;
        const scaleEffect = interpolate(
          Math.abs(translateX.value),
          [0, SCREEN_WIDTH / 4],
          [1, 0.98],
          'clamp',
        );
        return {
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value - verticalAdjustment },
            { rotate: rotation },
            { scale: scaleEffect },
          ],
          zIndex: 10,
          opacity: 1,
        };
      } else {
        const adjustedWidth = SCREEN_WIDTH - 30 * SCALE_FACTOR - stackOffset;
        const adjustedHeight = SCREEN_HEIGHT * 0.75 - stackOffset;
        return {
          marginHorizontal: stackOffset / 2,
          marginTop: stackOffset,
          width: adjustedWidth,
          height: adjustedHeight,
          zIndex: 1,
          transform: [{ scale: cardScale.value }],
          opacity: opacity.value,
        };
      }
    }, [isCurrent, stackOffset]);

    const leftIndicatorStyle = useAnimatedStyle(() => ({
      opacity: leftIndicatorOpacity.value,
      transform: [
        { scale: interpolate(leftIndicatorOpacity.value, [0, 1], [0.8, 1]) },
      ],
    }));

    const rightIndicatorStyle = useAnimatedStyle(() => ({
      opacity: rightIndicatorOpacity.value,
      transform: [
        { scale: interpolate(rightIndicatorOpacity.value, [0, 1], [0.8, 1]) },
      ],
    }));

    if (isCurrent) {
      return (
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          activeOffsetX={[-5, 5]}
          failOffsetY={[-20, 20]}
        >
          <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <CardContent card={card} />
            <Animated.View
              style={[
                styles.swipeIndicator,
                styles.leftIndicator,
                leftIndicatorStyle,
              ]}
            >
              <Ionicons
                name="close-circle"
                size={scaleSize(60)}
                color="rgba(208, 57, 3, 0.9)"
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.swipeIndicator,
                styles.rightIndicator,
                rightIndicatorStyle,
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={scaleSize(60)}
                color="rgba(82, 183, 24, 0.9)"
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      );
    }
    return (
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <CardContent card={card} />
      </Animated.View>
    );
  },
);

/**
 * =============================================================================
 * MAIN COMPONENT: Map
 * =============================================================================
 */
const Map: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<TourLocation | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showIndoorMap, setShowIndoorMap] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(false);
  const [currentTourPoint, setCurrentTourPoint] = useState(0);
  const mapRef = useRef<MapView>(null);

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (searchQuery.trim() === '') {
      return AIOU_CAMPUS_LOCATIONS;
    }
    return AIOU_CAMPUS_LOCATIONS.filter(
      location =>
        location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Handle location selection
  const handleLocationSelect = useCallback((location: TourLocation) => {
    setSelectedLocation(location);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'AIOU Campus Tour needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.log('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  }, []);

  // Get directions to location
  const getDirections = useCallback(
    async (destination: TourLocation) => {
      if (!userLocation) {
        await getCurrentLocation();
      }

      if (userLocation && destination) {
        const origin = `${userLocation.latitude},${userLocation.longitude}`;
        const dest = `${destination.latitude},${destination.longitude}`;

        // Open Google Maps with directions
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`;
        Linking.openURL(url);
      }
    },
    [userLocation, getCurrentLocation],
  );

  // Start guided tour
  const startGuidedTour = useCallback((location: TourLocation) => {
    setShowTourGuide(true);
    setCurrentTourPoint(0);
  }, []);

  // Next tour point
  const nextTourPoint = useCallback(() => {
    if (selectedLocation?.tourPoints) {
      setCurrentTourPoint(prev =>
        prev < selectedLocation.tourPoints!.length - 1 ? prev + 1 : 0,
      );
    }
  }, [selectedLocation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#01848F', '#016972']}
        style={[styles.headerWrapper, { paddingTop: insets.top + 2 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Campus Tour</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 33.6844,
          longitude: 73.0479,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="#01848F"
          />
        )}
        {filteredLocations.map(location => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => handleLocationSelect(location)}
          >
            <View style={styles.markerContainer}>
              <Ionicons
                name={getCategoryIcon(location.category)}
                size={24}
                color="#01848F"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedLocation && (
        <View style={styles.locationCard}>
          <Image
            source={{ uri: selectedLocation.image }}
            style={styles.locationImage}
          />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{selectedLocation.title}</Text>
            <Text style={styles.locationDescription}>
              {selectedLocation.description}
            </Text>
            <View style={styles.locationDetails}>
              {selectedLocation.floor && (
                <View style={styles.detailRow}>
                  <Ionicons name="business" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {selectedLocation.floor}
                  </Text>
                </View>
              )}
              {selectedLocation.hours && (
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {selectedLocation.hours}
                  </Text>
                </View>
              )}
              {selectedLocation.contact && (
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {selectedLocation.contact}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.directionsButton]}
                onPress={() => getDirections(selectedLocation)}
              >
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.directionsText}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() =>
                  Linking.openURL(`tel:${selectedLocation.contact}`)
                }
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
            </View>
            {selectedLocation.indoorMap && (
              <TouchableOpacity
                style={styles.indoorMapButton}
                onPress={() => setShowIndoorMap(true)}
              >
                <Ionicons name="map" size={20} color="#01848F" />
                <Text style={styles.indoorMapText}>View Indoor Map</Text>
              </TouchableOpacity>
            )}
            {selectedLocation.tourPoints && (
              <TouchableOpacity
                style={styles.tourButton}
                onPress={() => startGuidedTour(selectedLocation)}
              >
                <Ionicons name="walk" size={20} color="#01848F" />
                <Text style={styles.tourText}>Start Guided Tour</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <Modal
        visible={showIndoorMap}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIndoorMap(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowIndoorMap(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedLocation?.indoorMap }}
              style={styles.indoorMapImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTourGuide}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTourGuide(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTourGuide(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.tourGuideTitle}>Guided Tour</Text>
            <Text style={styles.tourPointTitle}>
              {selectedLocation?.tourPoints?.[currentTourPoint]}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextTourPoint}>
              <Text style={styles.nextButtonText}>Next Point</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={filteredLocations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationListItem}
            onPress={() => handleLocationSelect(item)}
          >
            <View style={styles.locationIcon}>
              <Ionicons
                name={getCategoryIcon(item.category)}
                size={20}
                color="#01848F"
              />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationListTitle}>{item.title}</Text>
              <Text style={styles.locationListDescription}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.locationsList}
      />
    </View>
  );
};

const AIOU_CAMPUS_LOCATIONS: TourLocation[] = [
  {
    id: '1',
    title: 'Main Administration Building',
    description: 'Central administrative offices and student services',
    latitude: 33.6844,
    longitude: 73.0479,
    category: 'administrative',
    image: 'https://example.com/admin-building.jpg',
    floor: 'Ground Floor',
    hours: '9:00 AM - 5:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/admin-indoor.jpg',
    tourPoints: [
      'Admissions Office',
      'Student Affairs',
      'Registrar Office',
      'Finance Department',
    ],
  },
  {
    id: '2',
    title: 'Central Library',
    description: 'Main library with extensive academic resources',
    latitude: 33.6846,
    longitude: 73.0481,
    category: 'academic',
    image: 'https://example.com/library.jpg',
    floor: '1st Floor',
    hours: '8:00 AM - 8:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/library-indoor.jpg',
    tourPoints: [
      'Reading Hall',
      'Digital Resources',
      'Research Section',
      'Book Issue Counter',
    ],
  },
  {
    id: '3',
    title: 'Student Center',
    description: 'Cafeteria, lounge areas, and student activities',
    latitude: 33.6848,
    longitude: 73.0483,
    category: 'recreational',
    image: 'https://example.com/student-center.jpg',
    floor: 'Ground Floor',
    hours: '8:00 AM - 10:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/center-indoor.jpg',
    tourPoints: [
      'Cafeteria',
      'Student Lounge',
      'Activity Rooms',
      'Prayer Area',
    ],
  },
  {
    id: '4',
    title: 'Computer Labs',
    description: 'State-of-the-art computing facilities',
    latitude: 33.685,
    longitude: 73.0485,
    category: 'academic',
    image: 'https://example.com/computer-lab.jpg',
    floor: '2nd Floor',
    hours: '9:00 AM - 5:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/lab-indoor.jpg',
    tourPoints: [
      'Programming Lab',
      'Networking Lab',
      'Multimedia Lab',
      'Research Lab',
    ],
  },
  {
    id: '5',
    title: 'Academic Block A',
    description: 'Faculty offices and classrooms',
    latitude: 33.6852,
    longitude: 73.0487,
    category: 'academic',
    image: 'https://example.com/block-a.jpg',
    floor: '3 Floors',
    hours: '8:00 AM - 8:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/block-a-indoor.jpg',
    tourPoints: [
      'Faculty Offices',
      'Classrooms',
      'Seminar Hall',
      'Department Office',
    ],
  },
  {
    id: '6',
    title: 'Sports Complex',
    description: 'Indoor and outdoor sports facilities',
    latitude: 33.6854,
    longitude: 73.0489,
    category: 'recreational',
    image: 'https://example.com/sports-complex.jpg',
    floor: 'Ground Floor',
    hours: '6:00 AM - 10:00 PM',
    contact: '+92 51 111 112 468',
    indoorMap: 'https://example.com/sports-indoor.jpg',
    tourPoints: [
      'Gymnasium',
      'Basketball Court',
      'Badminton Court',
      'Swimming Pool',
    ],
  },
];

export default Map;

/**
 * =============================================================================
 * STYLES
 * =============================================================================
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerWrapper: {
    backgroundColor: '#01848F',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 90,
    left: 20,
    zIndex: 2,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 120,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationCard: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.3,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  directionsButton: {
    backgroundColor: '#01848F',
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  directionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  callText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  indoorMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E6F7FF',
    marginBottom: 8,
  },
  indoorMapText: {
    color: '#01848F',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  tourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E6F7FF',
  },
  tourText: {
    color: '#01848F',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: '#01848F',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indoorMapImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  tourGuideTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  tourPointTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#01848F',
    marginBottom: 24,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#01848F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  locationsList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  locationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationListTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  locationListDescription: {
    fontSize: 12,
    color: '#666',
  },
  suggestionItem: {
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: { flexDirection: 'row', alignItems: 'center' },
  suggestionIconContainer: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    backgroundColor: 'rgba(1, 132, 143, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaleSize(10),
  },
  suggestionTextContainer: { flex: 1 },
  suggestionTitle: {
    fontSize: scaleSize(14),
    fontWeight: '500',
    color: '#333',
  },
  suggestionCategory: {
    fontSize: scaleSize(12),
    color: '#666',
    marginTop: scaleSize(2),
  },
  suggestionPrice: {
    fontSize: scaleSize(12),
    color: '#01848F',
    fontWeight: '500',
  },
  suggestionsLoading: {
    padding: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  suggestionsLoadingText: {
    marginLeft: scaleSize(10),
    fontSize: scaleSize(14),
    color: '#666',
  },
  noSuggestionsText: {
    padding: scaleSize(20),
    textAlign: 'center',
    color: '#666',
    fontSize: scaleSize(14),
  },
  providerCarouselContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.0595,
    left: 0,
    right: 0,
  },
  providerCarouselLoading: {
    backgroundColor: 'white',
    padding: scaleSize(15),
    bottom: SCREEN_HEIGHT * 0.03,
    margin: scaleSize(20),
    borderRadius: scaleSize(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
  },
  providerCarouselLoadingText: {
    marginLeft: scaleSize(10),
    fontSize: scaleSize(14),
    color: '#666',
  },
  noProvidersContainer: {
    backgroundColor: 'white',
    bottom: SCREEN_HEIGHT * 0.03,
    padding: scaleSize(15),
    margin: scaleSize(20),
    borderRadius: scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  noProvidersText: {
    marginTop: scaleSize(10),
    fontSize: scaleSize(16),
    color: '#333',
    textAlign: 'center',
  },
  carousel: { marginBottom: scaleSize(20) },
  providerCard: {
    position: 'relative',
    width: scaleSize(400),
    height: scaleSize(139),
    borderRadius: scaleSize(10),
    margin: scaleSize(10),
    borderWidth: 0.5,
  },
  selectedProviderCard: {
    borderColor: 'rgba(1, 132, 143, 0.95)',
  },
  providerCardContent: {
    flex: 1,
    position: 'relative',
    borderRadius: scaleSize(12),
  },
  providerImage: {
    position: 'absolute',
    width: scaleSize(85),
    height: scaleSize(84),
    left: scaleSize(22),
    top: scaleSize(28),
    borderRadius: scaleSize(12),
  },
  providerName: {
    position: 'absolute',
    width: scaleSize(116),
    left: scaleSize(132),
    top: scaleSize(33),
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: scaleSize(16),
    lineHeight: scaleSize(20),
    color: '#000',
  },
  distanceBadge: {
    position: 'absolute',
    width: scaleSize(53),
    height: scaleSize(23),
    right: scaleSize(21),
    top: scaleSize(26),
    backgroundColor: '#F9A11F',
    borderRadius: scaleSize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: scaleSize(12),
    lineHeight: scaleSize(15),
    color: '#FFFFFF',
  },
  providerDescription: {
    position: 'absolute',
    width: scaleSize(256),
    left: scaleSize(132),
    top: scaleSize(62),
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: scaleSize(11),
    lineHeight: scaleSize(13),
    color: '#000',
  },
  bookNowButton: {
    position: 'absolute',
    width: scaleSize(100),
    height: scaleSize(28),
    right: scaleSize(21),
    bottom: scaleSize(24),
    backgroundColor: '#EF4581',
    borderRadius: scaleSize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookNowText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: scaleSize(12),
    lineHeight: scaleSize(15),
    color: '#FFFFFF',
    marginRight: scaleSize(5),
  },
  selectedMarker: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#EF4581',
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sheetBackground: {
    backgroundColor: 'rgba(1, 132, 143, 0.95)',
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  handleStyle: {
    backgroundColor: 'rgba(1, 132, 143, 0.95)',
    borderTopLeftRadius: scaleSize(15),
    borderTopRightRadius: scaleSize(15),
    paddingTop: scaleSize(12),
  },
  handleIndicatorStyle: {
    backgroundColor: 'white',
    width: scaleSize(50),
    height: scaleSize(6),
  },
  scrollContent: {
    paddingBottom: scaleSize(30),
    paddingHorizontal: scaleSize(15),
  },
  toggleButton: {
    alignSelf: 'flex-end',
    right: scaleSize(10),
    marginBottom: scaleSize(15),
  },
  cardStackContainer: {
    position: 'relative',
    height: SCREEN_HEIGHT * 0.75,
    marginBottom: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT * 0.75,
    borderRadius: scaleSize(20),
    overflow: 'hidden',
    backgroundColor: '#E6F7F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
  },
  cardContent: { flex: 1, padding: scaleSize(20), paddingTop: scaleSize(25) },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: scaleSize(20),
    borderRadius: scaleSize(20),
    overflow: 'hidden',
  },
  cardBackgroundImage: { borderRadius: scaleSize(20), opacity: 0.6 },
  cardTitle: {
    fontSize: scaleSize(32),
    fontWeight: '600',
    color: '#000',
    lineHeight: scaleSize(40),
    width: '70%',
  },
  ratingBadge: {
    position: 'absolute',
    top: scaleSize(30),
    right: scaleSize(20),
    width: scaleSize(68.11),
    height: scaleSize(68.11),
    borderRadius: scaleSize(34),
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 2,
  },
  ratingText: {
    fontSize: scaleSize(17),
    fontFamily: 'Inter',
    fontWeight: '900',
    color: '#fff',
  },
  statsContainer: {
    position: 'absolute',
    bottom: scaleSize(24),
    left: scaleSize(24),
    right: scaleSize(24),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  statsLeftContainer: { flexDirection: 'column', justifyContent: 'flex-start' },
  workersStat: {
    width: scaleSize(105),
    height: scaleSize(54),
    backgroundColor: 'rgba(239,69,129,0.85)',
    borderRadius: scaleSize(6),
    padding: scaleSize(8),
    marginBottom: scaleSize(8),
  },
  jobsDoneStat: {
    width: scaleSize(105),
    height: scaleSize(80),
    backgroundColor: 'rgba(1,132,143,0.71)',
    borderRadius: scaleSize(6),
    padding: scaleSize(8),
    marginBottom: scaleSize(8),
  },
  businessCard: {
    width: scaleSize(232),
    height: scaleSize(140),
    backgroundColor: 'white',
    borderRadius: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsNumberLarge: {
    fontSize: scaleSize(20),
    fontWeight: '700',
    color: 'white',
    marginBottom: scaleSize(2),
  },
  statsNumberXLarge: {
    fontSize: scaleSize(31),
    fontWeight: '700',
    color: 'white',
    marginBottom: scaleSize(2),
  },
  statsLabel: { fontSize: scaleSize(12), fontWeight: '500', color: 'white' },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(10),
    marginTop: 'auto',
  },
  rejectButton: {
    width: scaleSize(55),
    height: scaleSize(55),
    borderRadius: scaleSize(27.5),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 12,
  },
  acceptButton: {
    width: scaleSize(55),
    height: scaleSize(55),
    borderRadius: scaleSize(27.5),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 12,
  },
  myListButton: {
    flex: 1,
    height: scaleSize(53),
    backgroundColor: '#EF4581',
    borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scaleSize(20),
  },
  myListText: { fontSize: scaleSize(16), fontWeight: '500', color: 'white' },
  finishedContainer: {
    height: SCREEN_HEIGHT * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedText: {
    fontSize: scaleSize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: scaleSize(20),
  },
  endMyListButton: {
    width: scaleSize(200),
    height: scaleSize(53),
    backgroundColor: '#EF4581',
    borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#01848F',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(10),
    borderRadius: scaleSize(20),
    marginTop: scaleSize(10),
  },
  resetButtonText: {
    color: 'white',
    fontSize: scaleSize(16),
    fontWeight: '500',
  },
  loadingContainer: {
    height: SCREEN_HEIGHT * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: scaleSize(18),
    color: 'white',
    marginTop: scaleSize(20),
  },
  emptyStateContainer: {
    height: SCREEN_HEIGHT * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleSize(20),
  },
  emptyStateText: {
    fontSize: scaleSize(18),
    fontFamily: 'Inter',
    color: 'white',
    textAlign: 'center',
    marginTop: scaleSize(20),
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    marginTop: scaleSize(-30),
    zIndex: 100,
  },
  leftIndicator: { left: scaleSize(30) },
  rightIndicator: { right: scaleSize(30) },
  suggestionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scaleSize(185) : scaleSize(180),
    left: scaleSize(20),
    right: scaleSize(20),
    backgroundColor: 'white',
    borderRadius: scaleSize(15),
    maxHeight: SCREEN_HEIGHT * 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleSize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionsTitle: {
    fontSize: scaleSize(16),
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    paddingVertical: scaleSize(5),
    paddingHorizontal: scaleSize(10),
  },
  viewAllText: { fontSize: scaleSize(14), color: '#01848F', fontWeight: '500' },
  suggestionsList: { flex: 1 },
  suggestionsContent: { paddingBottom: scaleSize(10) },
  clearButton: {
    padding: 4,
  },
});
