import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import RootStack from './StackScreens';
import RootNavigator from './RootNavigator';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
