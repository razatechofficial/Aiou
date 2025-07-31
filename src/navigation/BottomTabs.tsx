import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { StyleSheet, TouchableOpacity } from 'react-native';
import Profile from '../screens/customer/Profile';
import Home from '../screens/customer/Home';
import { LinearShadowView } from 'react-native-inner-shadow';
import Map from '../screens/customer/Map';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#01848F',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home-filled" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Add"
        component={Map}
        options={{
          tabBarIcon: () => null,
          tabBarButton: props => (
            <LinearShadowView style={styles.addButton} inset>
              <TouchableOpacity {...props} style={styles.touchable}>
                <MaterialIcons name="add" size={28} color="white" />
              </TouchableOpacity>
            </LinearShadowView>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Jobs"
        component={JobRequestStatus}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01848F',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});
