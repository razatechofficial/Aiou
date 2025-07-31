import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetProps,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type SnapPoint = string | number;

interface CustomBottomSheetProps
  extends Omit<BottomSheetProps, 'snapPoints' | 'children'> {
  isVisible?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showCloseButton?: boolean;
  backgroundColor?: string;
  headerBackgroundColor?: string;
  customSnapPoints?: SnapPoint[];
  defaultSnapIndex?: number;
  closeOnDragDown?: boolean;
  showLoader?: boolean;
  loaderColor?: string;
  loaderSize?: 'small' | 'large';
  loaderStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  handleStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  headerTitleStyle?: TextStyle;
  headerSubtitleStyle?: TextStyle;
  closeButtonStyle?: ViewStyle;
  closeButtonTextStyle?: TextStyle;
  backdropProps?: Partial<BottomSheetBackdropProps>;
}

const DEFAULT_SNAP_POINTS: SnapPoint[] = ['25%', '50%', '75%', '90%'];

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  isVisible = true,
  onClose,
  children,
  title,
  subtitle,
  showHeader = true,
  showCloseButton = false,
  backgroundColor = 'white',
  headerBackgroundColor = 'white',
  customSnapPoints,
  defaultSnapIndex = 0,
  closeOnDragDown = false,
  showLoader = false,
  loaderColor = '#007AFF',
  loaderSize = 'large',
  loaderStyle,
  containerStyle,
  handleStyle,
  handleIndicatorStyle,
  contentContainerStyle,
  headerStyle,
  headerTitleStyle,
  headerSubtitleStyle,
  closeButtonStyle,
  closeButtonTextStyle,
  backdropProps,
  ...bottomSheetProps
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(isVisible);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapIndex);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const snapPoints = React.useMemo(
    () => customSnapPoints || DEFAULT_SNAP_POINTS,
    [customSnapPoints],
  );

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsSheetVisible(false);
    onClose?.();
  }, [onClose]);

  const handleSheetChange = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);
      if (index === -1) {
        handleCloseSheet();
      }
    },
    [handleCloseSheet],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [backdropProps],
  );

  // Hide the bottom tab bar when the bottom sheet is visible, and show it when it's hidden
  useEffect(() => {
    if (isVisible) {
      setIsSheetVisible(true);
      bottomSheetRef.current?.snapToIndex(defaultSnapIndex);
      // Hide the bottom tab bar when the bottom sheet is visible
      navigation.setOptions({
        tabBarStyle: {display: 'none'}, // Hide the bottom tab bar
      });
    } else {
      setIsSheetVisible(false);
      // Show the bottom tab bar when the bottom sheet is hidden
      navigation.setOptions({
        tabBarStyle: {display: 'flex'}, // Show the bottom tab bar
      });
    }
  }, [isVisible, defaultSnapIndex, navigation]);

  const getLoaderStyle = useCallback((): ViewStyle => {
    const currentHeight =
      typeof snapPoints[currentSnapIndex] === 'number'
        ? snapPoints[currentSnapIndex]
        : SCREEN_HEIGHT * 0.25;

    return {
      height: currentHeight - (showHeader ? 100 : 0),
      justifyContent: 'center',
      alignItems: 'center',
      ...loaderStyle,
    };
  }, [currentSnapIndex, showHeader, loaderStyle, snapPoints]);

  const renderContent = useCallback(() => {
    if (showLoader) {
      return (
        <View style={getLoaderStyle()}>
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        </View>
      );
    }
    return children;
  }, [showLoader, getLoaderStyle, loaderSize, loaderColor, children]);

  if (!isSheetVisible) {
    return null;
  }

  return (
    <GestureHandlerRootView style={[styles.container, containerStyle]}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose={closeOnDragDown}
        backdropComponent={renderBackdrop}
        handleStyle={[
          styles.handleStyle,
          {backgroundColor: headerBackgroundColor},
          handleStyle,
        ]}
        handleIndicatorStyle={[
          styles.handleIndicatorStyle,
          handleIndicatorStyle,
        ]}
        backgroundStyle={{backgroundColor}}
        {...bottomSheetProps}>
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: insets.bottom},
            contentContainerStyle,
          ]}>
          {showHeader && (
            <View
              style={[
                styles.header,
                {backgroundColor: headerBackgroundColor},
                headerStyle,
              ]}>
              {showCloseButton && (
                <TouchableOpacity
                  style={[styles.closeButton, closeButtonStyle]}
                  onPress={handleCloseSheet}>
                  <Text style={[styles.closeButtonText, closeButtonTextStyle]}>
                    {'✕'}
                  </Text>
                </TouchableOpacity>
              )}
              {title && (
                <Text style={[styles.headerTitle, headerTitleStyle]}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text style={[styles.headerSubtitle, headerSubtitleStyle]}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
          <View style={styles.mainContent}>{renderContent()}</View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  handleStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 12,
  },
  handleIndicatorStyle: {
    backgroundColor: '#DDDDDD',
    width: 50,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333333',
  },
});

export default CustomBottomSheet;
