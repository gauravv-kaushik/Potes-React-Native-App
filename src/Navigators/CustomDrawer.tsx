import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CustomDrawer = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { navigation, state } = props;
  const { routes, index } = state;

  const activeRouteName = routes[index].name;

  const activeNestedRoute =
    routes[index].state?.routes[routes[index].state.index];
  const activeNestedScreenName = activeNestedRoute?.name;

  const isFocused = (routeName: string, screenName?: string) => {
    if (screenName) {
      return (
        activeRouteName === routeName && activeNestedScreenName === screenName
      );
    }
    return activeRouteName === routeName;
  };

  const activeColor = '#36413e';
  const inactiveColor = '#000';
  const activeBackgroundColor = '#d9e0de';

  const handleLogout = () => {
    AsyncStorage.removeItem('accessToken');
    setModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../../assets/potes.png')}
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>

        <DrawerItem
          label="Home"
          focused={isFocused('Home', 'HomePage')}
          activeBackgroundColor={activeBackgroundColor}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: isFocused('Home', 'HomePage') ? activeColor : inactiveColor,
          }}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'HomePage',
            })
          }
        />
        <DrawerItem
          label="Directory"
          focused={isFocused('Home', 'Directory')}
          activeBackgroundColor={activeBackgroundColor}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: isFocused('Home', 'Directory') ? activeColor : inactiveColor,
          }}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Directory',
            })
          }
        />
        <DrawerItem
          label="About Us"
          focused={isFocused('About Us')}
          activeBackgroundColor={activeBackgroundColor}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: isFocused('About Us') ? activeColor : inactiveColor,
          }}
          onPress={() => navigation.navigate('About Us')}
        />

        <DrawerItem
          label="Contact Us"
          focused={isFocused('Contact Us')}
          activeBackgroundColor={activeBackgroundColor}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: isFocused('Contact Us') ? activeColor : inactiveColor,
          }}
          onPress={() => navigation.navigate('Contact Us')}
        />

        <DrawerItem
          labelStyle={{ fontSize: 16, fontWeight: '600', color: '#000' }}
          label="Logout"
          onPress={() => setModalVisible(true)}
        />
      </DrawerContentScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={handleLogout}
              >
                <Text style={styles.textStyle}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    objectFit: 'contain',
    borderRadius: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalText: {
    marginBottom: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: '#888',
  },
  buttonDelete: {
    backgroundColor: '#36413e',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    gap: 50,
  },
});

export default CustomDrawer;
