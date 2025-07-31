import {useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  AccessibilityInfo,
  type ScaledSize,
} from 'react-native';

// Type definitions
type DeviceType = 'phone' | 'tablet' | 'large-tablet';

interface ResponsiveOptions {
  baseWidth?: number;
  baseHeight?: number;
  minScaleFactor?: number;
  maxScaleFactor?: number;
}

interface Breakpoints {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

interface TextStyleOptions {
  emphasize?: boolean;
  lineHeightMultiplier?: number;
}

interface ResponsiveTextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight?: 'bold';
  includeFontPadding?: boolean;
  allowFontScaling?: boolean;
}

interface ResponsiveHookReturn {
  isPortrait: boolean;
  isLandscape: boolean;
  isTablet: boolean;
  deviceType: DeviceType;
  width: number;
  height: number;
  fontScale: number;
  isAccessibilityEnabled: boolean;
  breakpoints: Breakpoints;
  scaleSize: (size: number) => number;
  verticalScaleSize: (size: number) => number;
  responsiveFontSize: (size: number) => number;
  getResponsiveTextStyle: (
    baseSize: number,
    options?: TextStyleOptions,
  ) => ResponsiveTextStyle;
  // Shorthand aliases
  s: (size: number) => number;
  vs: (size: number) => number;
  fs: (size: number) => number;
  ts: (baseSize: number, options?: TextStyleOptions) => ResponsiveTextStyle;
}

// Custom debounce implementation with TypeScript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

const useResponsive = (
  options: ResponsiveOptions = {},
): ResponsiveHookReturn => {
  // Default options with type safety
  const {
    baseWidth = 375,
    baseHeight = 812,
    minScaleFactor = 0.5,
    maxScaleFactor = 1.5,
  } = options;

  const [dimensions, setDimensions] = useState<ScaledSize>(() =>
    Dimensions.get('window'),
  );
  const [fontScale, setFontScale] = useState<number>(() =>
    PixelRatio.getFontScale(),
  );
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] =
    useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    const {width} = Dimensions.get('window');
    if (width >= 900) return 'large-tablet';
    if (width >= 600) return 'tablet';
    return 'phone';
  });

  useEffect(() => {
    // Check accessibility features
    AccessibilityInfo.isScreenReaderEnabled().then((enabled: boolean) =>
      setIsAccessibilityEnabled(enabled),
    );

    const onChange = debounce(({window}: {window: ScaledSize}) => {
      setDimensions(window);
      setFontScale(PixelRatio.getFontScale());

      // Update device type when dimensions change
      if (window.width >= 900) setDeviceType('large-tablet');
      else if (window.width >= 600) setDeviceType('tablet');
      else setDeviceType('phone');
    }, 100);

    const subscription = Dimensions.addEventListener('change', onChange);

    // Platform-specific listeners
    let fontChangeSubscription: {remove: () => void} | undefined;
    if (Platform.OS === 'ios') {
      fontChangeSubscription = AccessibilityInfo.addEventListener(
        'boldTextChanged',
        () => setFontScale(PixelRatio.getFontScale()),
      );
    }

    return () => {
      subscription.remove();
      if (fontChangeSubscription) {
        fontChangeSubscription.remove();
      }
    };
  }, []);

  const {width, height} = dimensions;
  const isLandscape = width > height;
  const isTablet = deviceType !== 'phone';

  // Memoized scaling functions with proper return types
  const scaleSize = useCallback(
    (size: number): number => {
      const scale = Math.min(
        Math.max(width / baseWidth, minScaleFactor),
        maxScaleFactor,
      );
      const displaySizeCorrection = Platform.OS === 'android' ? fontScale : 1;
      return (size * scale) / displaySizeCorrection;
    },
    [width, fontScale, baseWidth, minScaleFactor, maxScaleFactor],
  );

  const verticalScaleSize = useCallback(
    (size: number): number => {
      const scale = Math.min(
        Math.max(height / baseHeight, minScaleFactor),
        maxScaleFactor,
      );
      const displaySizeCorrection = Platform.OS === 'android' ? fontScale : 1;
      return (size * scale) / displaySizeCorrection;
    },
    [height, fontScale, baseHeight, minScaleFactor, maxScaleFactor],
  );

  const responsiveFontSize = useCallback(
    (size: number): number => {
      const scaleFactor = Math.min(
        Math.max(
          Math.min(width / baseWidth, height / baseHeight),
          minScaleFactor,
        ),
        maxScaleFactor,
      );
      return Math.round(size * scaleFactor * fontScale);
    },
    [
      width,
      height,
      fontScale,
      baseWidth,
      baseHeight,
      minScaleFactor,
      maxScaleFactor,
    ],
  );

  const getResponsiveTextStyle = useCallback(
    (baseSize: number, options: TextStyleOptions = {}): ResponsiveTextStyle => {
      const {emphasize = false, lineHeightMultiplier = 1.3} = options;
      const fontSize = responsiveFontSize(baseSize);
      const shouldAdjustWeight = Platform.OS === 'ios' && fontScale > 1;

      const style: ResponsiveTextStyle = {
        fontSize,
        lineHeight: Math.round(fontSize * lineHeightMultiplier),
      };

      // Conditionally add properties based on platform and settings
      if (shouldAdjustWeight && emphasize) {
        style.fontWeight = 'bold';
      }

      if (Platform.OS === 'android') {
        style.includeFontPadding = false;
      } else if (Platform.OS === 'ios') {
        style.allowFontScaling = true;
      }

      return style;
    },
    [responsiveFontSize, fontScale],
  );

  // Breakpoint utilities with proper typing
  const getBreakpoints = useCallback(
    (): Breakpoints => ({
      xs: width < 360,
      sm: width >= 360 && width < 600,
      md: width >= 600 && width < 900,
      lg: width >= 900 && width < 1200,
      xl: width >= 1200,
    }),
    [width],
  );

  return {
    isPortrait: height > width,
    isLandscape,
    isTablet,
    deviceType,
    width,
    height,
    fontScale,
    isAccessibilityEnabled,
    breakpoints: getBreakpoints(),
    scaleSize,
    verticalScaleSize,
    responsiveFontSize,
    getResponsiveTextStyle,
    // Shorthand functions for convenience
    s: scaleSize,
    vs: verticalScaleSize,
    fs: responsiveFontSize,
    ts: getResponsiveTextStyle,
  };
};

export default useResponsive;
