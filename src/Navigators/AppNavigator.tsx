import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../Screens/SplashScreen';
import Main from '../Screens/Main';
import Profile from '../Screens/Profile';
import ChangePassword from '../Screens/ChangePassword';
import CreateContact from '../Screens/CreateContact';
import CreateNote from '../Screens/CreateNote';
import Register from '../Screens/Register';
import Login from '../Screens/Login';
import ForgotPassword from '../Screens/ForgotPassword';
import ForgotPasswordOTP from '../Screens/ForgotPasswordOTP';
import ForgotNewPassword from '../Screens/ForgotNewPassword';
import ViewContact from '../Screens/ViewContact';
import AllNotesScreen from '../Screens/AllNotesScreen';

const myStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <myStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <myStack.Screen name="Login" component={Login} />
        <myStack.Screen name="SplashScreen" component={SplashScreen} />
        <myStack.Screen name="Main" component={Main} />
        <myStack.Screen name="Profile" component={Profile} />
        <myStack.Screen name="ChangePassword" component={ChangePassword} />
        <myStack.Screen name="CreateContact" component={CreateContact} />
        <myStack.Screen name="CreateNote" component={CreateNote} />
        <myStack.Screen name="Register" component={Register} />
        <myStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <myStack.Screen name="ViewContact" component={ViewContact} />
        <myStack.Screen name="AllNotesScreen" component={AllNotesScreen} />
        <myStack.Screen
          name="ForgotPasswordOTP"
          component={ForgotPasswordOTP}
        />
        <myStack.Screen
          name="ForgotNewPassword"
          component={ForgotNewPassword}
        />
      </myStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
