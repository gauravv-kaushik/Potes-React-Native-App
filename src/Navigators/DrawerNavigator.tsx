import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HomeT from '../Screens/HomeT';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import Directory from '../Screens/Directory';
import HomePage from '../Screens/HomePage';
import AboutUs from '../Screens/AboutUs';
import ContactUs from '../Screens/ContactUs';

const myDrawer = createDrawerNavigator();

const DrawerNavigator: any = () => {
  return (
    <myDrawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#36413e',
        drawerActiveTintColor: '#fff',
        drawerType: 'front',
        drawerLabelStyle: {
          color: '#000',
          fontSize: 16,
          fontWeight: '600',
        },
        drawerStyle: {
          backgroundColor: '#bfb0a0',
          width: '75%',
        },
        drawerItemStyle: {
          borderColor: 'black',
          opacity: 0.9,
          borderRadius: 10,
        },
      }}
    >
      <myDrawer.Screen name="Home" component={HomeT} />
      <myDrawer.Screen name="About Us" component={AboutUs} />
      <myDrawer.Screen name="Contact Us" component={ContactUs} />
    </myDrawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
