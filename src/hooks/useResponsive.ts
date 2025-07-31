import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

// Get the screen dimensions
const {width, height} = Dimensions.get('window');

// Base screen dimensions (for scaling purposes)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const scaleSize = (size: number) => (width / BASE_WIDTH) * size;
const verticalScaleSize = (size: number) => (height / BASE_HEIGHT) * size;
const responsiveFontSize = (size: number) => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

// Function to check if the device is a tablet
const isTablet = width >= 600; // General rule for tablets (e.g., iPad's screen width ~768px)

const useResponsive = () => {
  const [isLandscape, setIsLandscape] = useState(width > height);

  useEffect(() => {
    const onChange = ({window}) => {
      const {width, height} = window;
      setIsLandscape(width > height); // Detect orientation change
    };

    Dimensions.addEventListener('change', onChange);

    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  return {
    isPortrait: height > width,
    isLandscape,
    isTablet,
    width,
    height,
    scaleSize,
    verticalScaleSize,
    responsiveFontSize,
  };
};

export default useResponsive;
