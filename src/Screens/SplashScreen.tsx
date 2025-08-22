import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setTimeout(() => {
          if (token) {
            navigation.replace('Main');
          } else {
            navigation.replace('Login');
          }
        }, 2000);
      } catch (e) {
        console.log('Error reading token', e);
        setTimeout(() => navigation.replace('Login'), 2000);
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <Image
        source={require('../../assets/potesw.png')} // path to your logo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#36413e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
