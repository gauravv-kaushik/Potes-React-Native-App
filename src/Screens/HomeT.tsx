import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BottomTabNavigator from '../Navigators/BottomTabNavigator';

const HomeT = () => {
  return (
    <View style={styles.container}>
      <BottomTabNavigator />
    </View>
  );
};

export default HomeT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
