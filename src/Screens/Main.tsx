import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DrawerNavigator from '../Navigators/DrawerNavigator';

const Main = () => {
  return (
    <View style={styles.container}>
      <DrawerNavigator />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
