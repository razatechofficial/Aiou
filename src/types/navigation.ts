// // src/types/navigation.ts

// import {NavigationProp, RouteProp} from '@react-navigation/native';

// export type RootStackParamList = {
//   Login: undefined;
//   Signup: undefined;
//   Home: undefined;
//   MainApp: {screen: string};
//   Profile: {
//     userId?: string;
//   };
//   Settings: undefined;
//   Conversations: {
//     recipientId: number;
//     recipientName: string;
//   };
// };

// export type StackNavigationProps<T extends keyof RootStackParamList> = {
//   navigation: NavigationProp<RootStackParamList, T>;
//   route: RouteProp<RootStackParamList, T>;
// };

// export type AppNavigation = NavigationProp<RootStackParamList>;
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 1. Define your stack param list
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  MainApp: { screen: string };
  Profile: { userId?: string };
  Settings: undefined;
  NotificationsStack: undefined;
  FavoritesStack: undefined;
  Conversations: {
    recipientId: number;
    recipientName: string;
  };
};

// 2. Use this for components receiving route + navigation props
export type StackNavigationProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// 3. For general use of navigation (e.g., with useNavigation)
export type AppNavigation = NativeStackNavigationProp<RootStackParamList>;
