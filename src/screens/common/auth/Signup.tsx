import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from '../../../types/navigation';
// import {AppNavigation} from '../types/navigation';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#01848F';
// const SECONDARY_COLOR = '#EF4581';
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const navigator = useNavigation<AppNavigation>();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://podiumapp.site/server/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Signup Successful', JSON.stringify(responseData, null, 2));
      } else {
        Alert.alert('Signup Failed', JSON.stringify(responseData, null, 2));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while trying to sign up. Please try again.',
      );
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <Image
            source={require('../../../assets/images/logo-b.png')}
            style={{ width: 100, height: 100 }}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start your journey</Text>
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.focusedInput,
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={errors.name ? '#EF4581' : '#666'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              </View>
            )}
            name="name"
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.focusedInput,
                ]}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={errors.email ? '#EF4581' : '#666'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
            name="email"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.focusedInput,
                ]}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={errors.password ? '#EF4581' : '#666'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialContainer}>
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or sign up with</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.socialButtonText}>GOOGLE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.socialButtonText}>FACEBOOK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.navigate('Login')}
          >
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.02,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandName: {
    fontSize: width * 0.06,
    color: '#EF4581',
    fontFamily: 'Jaini',
  },
  header: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: '#FFF5F8',
    height: Platform.OS === 'ios' ? 50 : 55,
  },
  focusedInput: {
    borderColor: '#EF4581',
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: width * 0.035,
    padding: 0,
  },
  passwordToggle: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: '#01848F',
    borderRadius: 12,
    height: Platform.OS === 'ios' ? 50 : 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  socialContainer: {
    marginVertical: height * 0.01,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  separatorText: {
    color: '#64748b',
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    flex: 1,
    maxWidth: width * 0.35,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: '600',
    fontSize: width * 0.03,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  loginText: {
    color: '#666',
    fontSize: width * 0.035,
  },
  loginLink: {
    color: '#EF4581',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginLeft: 15,
    marginTop: 2,
  },
});
