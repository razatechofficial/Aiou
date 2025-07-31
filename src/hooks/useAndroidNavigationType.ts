import {useState, useEffect} from 'react';
import {Dimensions, StatusBar, Platform} from 'react-native';

const useNavigationType = () => {
  const [navigationType, setNavigationType] = useState('unknown');

  const detectNavigationMode = () => {
    if (Platform.OS !== 'android') {
      return 'unknown';
    } // Only relevant for Android

    const screenHeight = Dimensions.get('screen').height;
    const windowHeight = Dimensions.get('window').height;
    const statusBarHeight = StatusBar.currentHeight || 0;

    // Calculate the height of the navigation bar (if present)
    const navigationBarHeight = screenHeight - windowHeight - statusBarHeight;

    // Threshold to determine if navigation bar is present (button mode)
    const threshold = 20; // Adjust based on testing across devices

    return navigationBarHeight > threshold ? 'buttons' : 'gestures';
  };

  useEffect(() => {
    // Set initial navigation type
    setNavigationType(detectNavigationMode());

    // Listen for dimension changes (e.g., navigation mode switch)
    const subscription = Dimensions.addEventListener('change', () => {
      setNavigationType(detectNavigationMode());
    });

    // Cleanup listener on unmount
    return () => {
      subscription?.remove();
    };
  }, []); // Empty dependency array since we only need this on mount and dimension changes

  return navigationType;
};

export default useNavigationType;
