import { StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Loader from '../../components/Loader';
import { Text } from 'react-native';
import { aboutUsDataApi } from '../../apiStore/services';

const AboutUs = ({ navigation }: any) => {
  const [loading, setLoading]: any = useState(false);
  const [aboutData, setAboutData]: any = useState([]);
  useEffect(() => {
    setLoading(true);
    aboutUsDataApi({
      query: {
        topic: 'about',
      },
    })
      .then((res: any) => {
        setAboutData(res?.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#36413e' }}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.innerdiv}>
          {loading && <Loader />}
          <Text style={styles.heading}>About us</Text>
          <Text style={styles.text}>{aboutData?.content}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    paddingTop: 40,
    paddingHorizontal: 20,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    marginBottom: 30,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    lineHeight: 25,
  },
});

export default AboutUs;
