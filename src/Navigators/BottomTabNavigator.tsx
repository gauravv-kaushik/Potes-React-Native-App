import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../Screens/HomePage';
import SearchPage from '../Screens/SearchPage';
import Directory from '../Screens/Directory';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const myBottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <myBottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#36413e',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#36413e',
          height: 80,
        },
      }}
    >
      <myBottomTab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <View style={focused ? styles.active : styles.deactive}>
              <Octicons name="home" size={size} color={color} />
            </View>
          ),
          title: 'Home',
          tabBarShowLabel: false,
          tabBarLabelPosition: 'beside-icon',
        }}
      />
      <myBottomTab.Screen
        name="SearchPage"
        component={SearchPage}
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <View style={focused ? styles.active : styles.deactive}>
              <Octicons name="search" size={size} color={color} />
            </View>
          ),
          title: 'Search',
          tabBarShowLabel: false,
          tabBarLabelPosition: 'beside-icon',
        }}
      />
      <myBottomTab.Screen
        name="Directory"
        component={Directory}
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <View style={focused ? styles.active : styles.deactive}>
              <MaterialIcons name="contacts" size={size} color={color} />
            </View>
          ),
          title: 'Contacts',
          tabBarShowLabel: false,
          tabBarLabelPosition: 'beside-icon',
        }}
      />
    </myBottomTab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  active: {
    backgroundColor: '#bfb0a0',
    height: 60,
    width: 60,
    borderWidth: 2,
    borderColor: '#36413e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  deactive: {},
});
