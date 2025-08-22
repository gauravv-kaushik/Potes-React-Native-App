import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import { useUser } from '../../context/UserContext';
import { getUserProfile } from '../../apiStore/services';

const Header = ({ navigation, left, from }: any) => {
  const { globalProfilePic, setGlobalProfilePic } = useUser();
  const getUserData = () => {
    getUserProfile().then((res: any) => {
      setGlobalProfilePic(res?.profile_pic);
    });
  };
  useEffect(() => {
    getUserData();
  }, []);
  const fromStackNavigation = () => {
    navigation.navigate('Main');
  };
  const fromDrawerNavigation = () => {
    navigation.navigate('Home', {
      screen: 'HomePage',
    });
  };
  return (
    <View style={styles.topview}>
      {left === 'back' ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome6Icon name="bars-staggered" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={from === 'stack' ? fromStackNavigation : fromDrawerNavigation}
        style={styles.logoContainer}
      >
        <Image
          source={require('../../assets/potesw.png')}
          style={styles.potesTextImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={styles.profile}
      >
        {globalProfilePic ? (
          <Image
            source={{ uri: globalProfilePic }}
            style={styles.headerProfileImage}
          />
        ) : (
          <Feather name="user" size={26} color="#fff" style={styles.icon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    paddingHorizontal: 15,
  },
  logoContainer: {
    height: '100%',
    width: '40%',
  },
  potesTextImage: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  profile: {
    backgroundColor: '#bfb0a0',
    borderRadius: 20,
  },
  icon: {
    padding: 4,
  },
  headerProfileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
});

export default Header;
