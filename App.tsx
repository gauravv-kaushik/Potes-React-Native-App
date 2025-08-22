import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppNavigator from './src/Navigators/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { UserProvider } from './context/UserContext';
const App = () => {
  return (
    <UserProvider>
      <AppNavigator />
      <Toast />
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
