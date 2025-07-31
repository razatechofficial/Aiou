// src/screens/common/auth/Login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { z } from 'zod';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { loginUser } from '../../../redux/features/authSlice';
import { RootStackParamList } from '../../../navigation/RootNavigator';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#01848F';

const Login: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(loginUser(data)).unwrap();
      // navigation.replace('Main', { screen: 'Home' }); // Navigate directly to Profile
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandContainer}>
            <Image
              source={require('../../../assets/images/logo-b.png')}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
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
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
            <Controller
              control={control}
              name="password"
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
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.socialContainer}>
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or continue with</Text>
              <View style={styles.separatorLine} />
            </View>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={24} color={PRIMARY_COLOR} />
                <Text style={styles.socialButtonText}>GOOGLE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={24} color={PRIMARY_COLOR} />
                <Text style={styles.socialButtonText}>FACEBOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>New to the Podium? </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Auth', { screen: 'Signup' })}
            >
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.02,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
  },
  header: { marginBottom: height * 0.04 },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
    textAlign: 'left',
  },
  subtitle: { fontSize: width * 0.04, color: '#666', textAlign: 'left' },
  inputContainer: { marginBottom: height * 0.02 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FFF5F8',
    minHeight: Platform.OS === 'ios' ? 55 : 60,
  },
  focusedInput: { borderColor: '#EF4581', backgroundColor: '#fff' },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: '#333',
    fontSize: width * 0.04,
    padding: 0,
    minHeight: Platform.OS === 'ios' ? 55 : 60,
  },
  passwordToggle: { padding: 8 },
  loginButton: {
    backgroundColor: '#01848F',
    borderRadius: 12,
    height: Platform.OS === 'ios' ? 55 : 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  forgotPassword: { alignSelf: 'flex-end', marginTop: 12, padding: 4 },
  forgotPasswordText: { color: '#EF4581', fontSize: width * 0.035 },
  socialContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  separatorText: {
    color: '#64748b',
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    flex: 1,
    maxWidth: width * 0.35,
    justifyContent: 'center',
  },
  socialButtonText: { color: PRIMARY_COLOR, marginLeft: 8, fontWeight: '600' },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: { color: '#666', fontSize: width * 0.035 },
  signupLink: { color: '#EF4581', fontWeight: 'bold', fontSize: width * 0.035 },
  errorText: { color: 'red', fontSize: 12, marginLeft: 15 },
});
