import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from './Header';
import { allContactsDirectory } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../../components/Loader';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

const Directory = ({ navigation }: any) => {
  const [allContacts, setAllContacts]: any = useState([]);
  const [loading, setLoading]: any = useState(false);
  const sectionListRef = useRef<SectionList>(null);

  const getDirectory = () => {
    // setLoading(true);
    allContactsDirectory({
      query: {},
    })
      .then((res: any) => {
        const sortedContacts = [...res?.results].sort((a, b) =>
          a.full_name.localeCompare(b.full_name),
        );

        const groupedContacts = sortedContacts.reduce((acc, contact) => {
          const firstLetter = contact.full_name[0].toUpperCase();
          const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : '#';
          if (!acc[key]) acc[key] = [];
          acc[key].push(contact);
          return acc;
        }, {} as any);

        const sections = Object.keys(groupedContacts)
          .sort((a: any, b: any) => {
            if (a === '#') return 1;
            if (b === '#') return -1;
            return a.localeCompare(b);
          })
          .map(letter => ({
            title: letter,
            data: groupedContacts[letter],
          }));

        setAllContacts(sections);
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: err?.data?.error,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getDirectory();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDirectory();
    }, []),
  );

  const scrollToSection = (index: number) => {
    if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  const handleScrollToLocationFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: info.highestMeasuredFrameIndex,
        itemIndex: 0,
        animated: false,
      });
      setTimeout(() => {
        scrollToSection(info.index);
      }, 100);
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  const formatPhone = (phone: any) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
  };

  /** 🔥 Memoized item renderer */
  const renderItem = useCallback(
    ({ item }: any) => (
      <ContactItem
        item={item}
        navigation={navigation}
        formatPhone={formatPhone}
      />
    ),
    [navigation],
  );

  /** 🔥 Memoized section header */
  const renderSectionHeader = useCallback(
    ({ section: { title } }: any) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#36413e' }}>
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

          <View style={styles.listContainer}>
            <SectionList
              ref={sectionListRef}
              sections={allContacts}
              keyExtractor={(item, index) => item.id.toString() + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              style={styles.list}
              onScrollToIndexFailed={handleScrollToLocationFailed}
              showsVerticalScrollIndicator={false}
              /** 🔥 Virtualization optimized */
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => ({
                length: 70,
                offset: 70 * index,
                index,
              })}
            />
            <View style={styles.alphabetSidebar}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                {alphabet.map(letter => {
                  const sectionIndex = allContacts.findIndex(
                    (section: any) => section.title === letter,
                  );
                  return (
                    <TouchableOpacity
                      key={letter}
                      onPress={() => scrollToSection(sectionIndex)}
                      disabled={sectionIndex === -1}
                    >
                      <Text style={styles.alphabetText}>{letter}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Directory;

/** 🔥 Contact row optimized + memoized */
const ContactItem = React.memo(
  ({ item, navigation, formatPhone }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ViewContact', {
          contact_id: item?.id,
        })
      }
    >
      <View style={styles.contactContainer}>
        <View style={styles.photoContainer}>
          {!item?.photo ? (
            <Feather name="user" color="#fff" size={24} />
          ) : (
            <Image source={{ uri: item?.photo }} style={styles.contactImage} />
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {item?.full_name}
          </Text>
          {item?.email && (
            <View style={styles.contactIconInfo}>
              <Feather name="mail" size={14} color="#e0e0e0" />
              <Text style={styles.text}>{item?.email}</Text>
            </View>
          )}
          {item?.phone && (
            <View style={styles.contactIconInfo}>
              <Feather name="phone" size={14} color="#e0e0e0" />
              <Text style={styles.text}>{formatPhone(item?.phone)}</Text>
            </View>
          )}
          {item?.birthday && (
            <View style={styles.contactIconInfo}>
              <Feather name="gift" size={14} color="#e0e0e0" />
              <Text style={styles.text}>
                {dayjs(item?.birthday).format('MM-DD-YYYY')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ),
  (prev, next) => prev.item.id === next.item.id, // shallow compare
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36413e',
    alignItems: 'center',
    paddingTop: 60,
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
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 25,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  list: {
    flex: 1,
    backgroundColor: '#36413e',
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  alphabetSidebar: {
    width: 25,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#36413e',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingVertical: 2,
  },
  alphabetText: {
    color: '#fff',
    fontSize: 11,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  contactIconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactName: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 15,
    marginBottom: 5,
  },
  text: {
    color: '#e0e0e0',
  },
});
