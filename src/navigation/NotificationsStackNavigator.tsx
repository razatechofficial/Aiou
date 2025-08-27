import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notifications from '../screens/main/Notifications';

export type NotificationsStackParamList = {
  Notifications: undefined;
  // Add more notification-related screens here in the future
  // NotificationDetail: { notificationId: string };
  // NotificationSettings: undefined;
};

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

export default function NotificationsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}
