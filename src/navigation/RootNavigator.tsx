// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import NotificationsStackNavigator from './NotificationsStackNavigator';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import Splash from '../screens/common/Splash';
import { AppDispatch, RootState } from '../redux/store';
import { checkAndRefreshToken } from '../redux/features/authSlice';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  NotificationsStack: undefined;
  FavoritesStack: undefined;
  Settings?: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Run checkAndRefreshToken only on app startup
  useEffect(() => {
    dispatch(checkAndRefreshToken()).finally(() => {
      setInitialCheckDone(true);
    });
  }, [dispatch]);

  // Show Splash screen only during initial loading
  if (loading || !initialCheckDone) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
      </Stack.Navigator>
    );
  }

  // Navigate based on authentication status
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="NotificationsStack"
            component={NotificationsStackNavigator}
          />
          <Stack.Screen
            name="FavoritesStack"
            component={FavoritesStackNavigator}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
