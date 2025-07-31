import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Navigation from './src/navigation';

import { Provider } from 'react-redux';
import store from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  return (
    // <SafeAreaProvider>
    //   <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    //   <Navigation />
    // </SafeAreaProvider>

    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <Provider store={store}>
            {/* <NavigationContainer> */}
              {/* <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE_KEY}
          merchantIdentifier="merchant.com.podium.uk" // Only required for Apple Pay
        > */}
              <Navigation />
              {/* </StripeProvider> */}
            {/* </NavigationContainer> */}
          </Provider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
