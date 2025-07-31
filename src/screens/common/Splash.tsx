// src/screens/common/Splash.tsx
import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import useNavigationType from '../../hooks/useAndroidNavigationType';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigationType = useNavigationType();

  // Android Navigation Bar Color
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const applyNavigationBarColor = async () => {
      try {
        if (navigationType === 'gestures') {
          await changeNavigationBarColor('transparent', true);
        }
      } catch (error) {
        console.error('Error applying navigation bar color:', error);
      }
    };

    applyNavigationBarColor();
  }, [navigationType]);

  // Navigate after auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Main' : 'Auth');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated]);

  return (
    <LinearGradient
      colors={['#1e3a8a', '#01848F']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.content}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>AIOU</Text>
        <Text style={styles.subtitle}>Education For All</Text>
        {loading && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <Text style={styles.footer}>v1.0.0</Text>
    </LinearGradient>
  );
};

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
    borderRadius: width * 0.15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
  },
  title: {
    fontSize: width * 0.18,
    color: '#fff',
    fontFamily: 'Jaini',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.05,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Jaini',
    letterSpacing: 1,
    textAlign: 'center',
  },
  footer: {
    color: '#fff',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 12,
    opacity: 0.7,
    fontFamily: Platform.select({ ios: 'Helvetica', android: 'Roboto' }),
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: '#ff4d4f',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Helvetica', android: 'Roboto' }),
  },
});
