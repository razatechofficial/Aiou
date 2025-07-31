import {useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  AccessibilityInfo,
} from 'react-native';

// Simple debounce implementation without lodash
const debounce = (
  func: {({window}: {window: any}): void; (arg0: any): void},
  wait: number | undefined,
) => {
  let timeout: string | number | NodeJS.Timeout | undefined;
  return (args: Parameters<typeof func>[0]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(args), wait);
  };
};

const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [fontScale, setFontScale] = useState(() => PixelRatio.getFontScale());
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);

  // Base screen dimensions (for scaling purposes)
  const BASE_WIDTH = 375;
  const BASE_HEIGHT = 812;

  useEffect(() => {
    // Check if any accessibility features are enabled
    if (Platform.OS === 'android') {
      AccessibilityInfo.isScreenReaderEnabled().then(setIsAccessibilityEnabled);
    }

    const onChange = debounce(({window}) => {
      setDimensions(window);
      // Update fontScale when dimensions change
      setFontScale(PixelRatio.getFontScale());
    }, 100);

    const subscription = Dimensions.addEventListener('change', onChange);

    // Listen for changes to font scale (for iOS)
    if (Platform.OS === 'ios') {
      const fontChangeSubscription = AccessibilityInfo.addEventListener(
        'boldTextChanged',
        () => setFontScale(PixelRatio.getFontScale()),
      );

      return () => {
        subscription.remove();
        fontChangeSubscription.remove();
      };
    }

    return () => {
      subscription.remove();
    };
  }, []);

  const {width, height} = dimensions;
  const isLandscape = width > height;
  const isTablet = width >= 600;

  // Adjusted scale functions to account for system display size settings
  const scaleSize = useCallback(
    (size: number) => {
      const scale = width / BASE_WIDTH;
      const displaySizeCorrection = Platform.OS === 'android' ? fontScale : 1;
      return (size * scale) / displaySizeCorrection;
    },
    [width, fontScale],
  );

  const verticalScaleSize = useCallback(
    (size: number) => {
      const scale = height / BASE_HEIGHT;
      const displaySizeCorrection = Platform.OS === 'android' ? fontScale : 1;
      return (size * scale) / displaySizeCorrection;
    },
    [height, fontScale],
  );

  const responsiveFontSize = useCallback(
    (size: number) => {
      const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
      return Math.round(size * scaleFactor * fontScale);
    },
    [width, height, fontScale],
  );

  // Enhanced font size function to handle font weight scenarios
  const getResponsiveTextStyle = useCallback(
    (baseSize: number, emphasize = false) => {
      const fontSize = responsiveFontSize(baseSize);

      // Detect if bold text is enabled on iOS
      const shouldAdjustWeight = Platform.OS === 'ios' && fontScale > 1;

      return {
        fontSize,
        // Adjust font weight based on system settings
        ...(shouldAdjustWeight && emphasize ? {fontWeight: 'bold'} : {}),
        // Ensure text can scale properly with system settings
        ...Platform.select({
          android: {includeFontPadding: false},
          ios: {allowFontScaling: true},
        }),
      };
    },
    [responsiveFontSize, fontScale],
  );

  return {
    isPortrait: height > width,
    isLandscape,
    isTablet,
    width,
    height,
    fontScale,
    isAccessibilityEnabled,
    scaleSize,
    verticalScaleSize,
    responsiveFontSize,
    getResponsiveTextStyle,
  };
};

export default useResponsive;
