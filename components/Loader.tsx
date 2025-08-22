import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
