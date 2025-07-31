import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from '../../types/navigation';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import useNavigationType from '../../hooks/useAndroidNavigationType';

const { width } = Dimensions.get('window');

const Splash = () => {
  const navigator = useNavigation<AppNavigation>();

  //! Naviagtion Bar color for ANDROID
  const navigationType = useNavigationType();
  useEffect(() => {
    if (Platform.OS !== 'android') {
      console.log('Skipping navigation bar color change: Not Android');
      return;
    }

    console.log('useEffect running with navigationType:', navigationType);

    const applyNavigationBarColor = () => {
      try {
        if (navigationType === 'gestures') {
          changeNavigationBarColor('transparent', true);
        } else if (navigationType === 'buttons') {
          console.log(
            'Button navigation detected, leaving default (no change)',
          );
          // Do nothing to keep the default system color
        } else {
          console.log('Navigation type is unknown, skipping');
        }
      } catch (error) {
        console.error('Error applying navigation bar color:', error);
      }
    };

    applyNavigationBarColor();
  }, [navigationType]);
  useEffect(() => {
    // setTimeout(() => {
    //   navigator.replace('Login');
    // }, 2000);
    const timer = setTimeout(() => {
      navigator.replace('MainApp');
    }, 2000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigator]);
  return (
    <LinearGradient
      colors={['#1e3a8a', '#01848F']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor={'transparent'}
      />
      <View style={styles.content}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>AIOU</Text>

        <Text style={styles.subtitle}>Education For All</Text>
      </View>
      <Text style={styles.footer}>v1.0.0</Text>
    </LinearGradient>
  );
};
// 1e3a8a
export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 190,
    width: 190,
  },
  title: {
    paddingTop: 15,
    fontSize: width * 0.18,
    color: 'white',
    fontFamily: 'Jaini',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: width * 0.05,
    color: 'white',
    marginTop: 10,
    fontFamily: 'Jaini',
    letterSpacing: 1,
  },
  footer: {
    color: 'white',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
});
