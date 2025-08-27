import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorites from '../screens/main/Favorites';

export type FavoritesStackParamList = {
  Favorites: undefined;
  // Add more favorite-related screens here in the future
  // FavoriteDetail: { favoriteId: string };
  // FavoriteSettings: undefined;
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Favorites" component={Favorites} />
    </Stack.Navigator>
  );
}
