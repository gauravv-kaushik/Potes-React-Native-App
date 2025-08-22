import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import HomeSection from '../../components/HomeSection';
import {
  birthdaysApi,
  memoriesApi,
  remindersApi,
} from '../../apiStore/services';
import { useFocusEffect } from '@react-navigation/native';
import Memories from '../../components/Memories';
import Birthdays from '../../components/Birthdays';
import { useUser } from '../../context/UserContext';
import Loader from '../../components/Loader';
import { StatusBar } from 'react-native';

const HomePage = ({ navigation }: any) => {
  const { homeReloadFlag } = useUser();
  const [reminderData, setReminderData]: any = useState({});
  const [memoriesData, setMemoriesData]: any = useState({});
  const [birthdaysData, setBirthdaysData]: any = useState({});
  const [loading, setLoading]: any = useState(false);

  const getAllHomeData = () => {
    setLoading(true);
    remindersApi().then((res: any) => {
      setReminderData(res?.reminders);
    });
    memoriesApi().then((res: any) => {
      setMemoriesData(res);
    });
    birthdaysApi()
      .then((res: any) => {
        setBirthdaysData(res);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getAllHomeData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllHomeData();
    }, [homeReloadFlag]),
  );
  const homeSections = [
    {
      key: 'reminders',
      component: <HomeSection heading="Reminders" data={reminderData} />,
    },
    {
      key: 'memories',
      component: <Memories heading="Memories" data={memoriesData} />,
    },
    {
      key: 'birthdays',
      component: <Birthdays heading="Events" data={birthdaysData} />,
    },
  ];
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: '#36413e' }}
    >
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.innerdiv}>
          {loading && <Loader />}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.pressable}
              onPress={() => navigation.navigate('CreateContact')}
            >
              <Text style={styles.pressableText}>+ Create Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pressable}
              onPress={() => navigation.navigate('CreateNote')}
            >
              <Text style={styles.pressableText}>+ Create Note</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={homeSections}
            keyExtractor={item => item.key}
            renderItem={({ item }) => item.component}
            style={styles.section}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36413e',
    alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
  innerdiv: {
    backgroundColor: '#bfb0a0',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 20,
  },
  pressable: {
    backgroundColor: '#36413e',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 15,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressableText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  scrollContainer: {
    width: '100%',
  },
  section: {
    width: '100%',
  },
});
