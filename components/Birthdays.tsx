import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Birthdays = ({ heading, data }: any) => {
  const navigation: any = useNavigation();

  return (
    <>
      {data?.birthdays?.length === 0 &&
      data?.anniversary?.length === 0 &&
      data?.spouse_birthday?.length === 0 &&
      data?.child_birthday?.length === 0 ? (
        <View
          style={{
            ...styles.reminderContainer,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{
              color: '#fff',
              margin: 40,
              fontWeight: '600',
              fontSize: 18,
            }}
          >
            No Events for today
          </Text>
        </View>
      ) : (
        <View style={styles.reminderContainer}>
          <Text style={styles.headings}>{heading}</Text>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.headingView}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#fff',
                }}
              >
                Birthdays
              </Text>
            </View>

            {data?.birthdays?.length > 0 ? (
              <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
                <FlatList
                  data={data?.birthdays}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={styles.reminder}
                      onPress={() =>
                        navigation.navigate('ViewContact', {
                          contact_id: item?.id,
                        })
                      }
                    >
                      <View style={styles.noteTextView}>
                        <View style={styles.photoContainer}>
                          {!item?.photo ? (
                            <Feather name="user" color="#fff" size={24} />
                          ) : (
                            <Image
                              source={{
                                uri: item?.photo,
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 20,
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 16,
                            marginBottom: 5,
                            color: '#fff',
                            fontWeight: '600',
                          }}
                        >
                          {item?.full_name}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.dates}>
                          {dayjs(item?.birthday).format('MM-DD-YYYY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item?.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <Text style={styles.noBirthdayText}>No Birthdays today</Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.headingView}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#fff',
                }}
              >
                Anniversary
              </Text>
            </View>
            {data?.anniversary?.length > 0 ? (
              <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
                <FlatList
                  data={data?.anniversary}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={styles.reminder}
                      onPress={() =>
                        navigation.navigate('ViewContact', {
                          contact_id: item?.id,
                        })
                      }
                    >
                      <View style={styles.noteTextView}>
                        <View style={styles.photoContainer}>
                          {!item?.photo ? (
                            <Feather name="user" color="#fff" size={24} />
                          ) : (
                            <Image
                              source={{
                                uri: item?.photo,
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 20,
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 16,
                            marginBottom: 5,
                            color: '#fff',
                            fontWeight: '600',
                          }}
                        >
                          {item?.full_name}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.dates}>
                          {dayjs(item?.anniversary).format('MM-DD-YYYY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item?.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <Text style={styles.noBirthdayText}>No Anniversary today</Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.headingView}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#fff',
                }}
              >
                Spouse's Birthdays
              </Text>
            </View>
            {data?.spouse_birthday?.length > 0 ? (
              <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
                <FlatList
                  data={data?.spouse_birthday}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={styles.reminder}
                      onPress={() =>
                        navigation.navigate('ViewContact', {
                          contact_id: item?.id,
                        })
                      }
                    >
                      <View style={styles.noteTextView}>
                        <View style={styles.photoContainer}>
                          {!item?.photo ? (
                            <Feather name="user" color="#fff" size={24} />
                          ) : (
                            <Image
                              source={{
                                uri: item?.photo,
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 20,
                              }}
                            />
                          )}
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              marginBottom: 5,
                              fontWeight: '600',
                              color: '#fff',
                            }}
                          >
                            {item?.spouse_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              marginBottom: 5,
                              color: '#cccccc',
                            }}
                          >
                            {`(${item?.full_name}'s Spouse)`}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.dates}>
                          {dayjs(item?.spouse_birthday).format('MM-DD-YYYY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item?.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <Text style={styles.noBirthdayText}>
                No Spouse's Birthday today
              </Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.headingView}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#fff',
                }}
              >
                Family Member's Birthdays
              </Text>
            </View>
            {data?.child_birthday?.length > 0 ? (
              <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
                <FlatList
                  data={data?.child_birthday}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={styles.reminder}
                      onPress={() =>
                        navigation.navigate('ViewContact', {
                          contact_id: item?.contact,
                        })
                      }
                    >
                      <View style={styles.noteTextView}>
                        <View style={styles.photoContainer}>
                          {!item?.contact__photo ? (
                            <Feather name="user" color="#fff" size={24} />
                          ) : (
                            <Image
                              source={{
                                uri: item?.contact__photo,
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 20,
                              }}
                            />
                          )}
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              marginBottom: 5,
                              color: '#fff',
                            }}
                          >
                            {item?.name ? item?.name : ''}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              marginBottom: 5,
                              color: '#cccccc',
                            }}
                          >
                            {`(${item?.contact__full_name}'s Family Member)`}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.dates}>
                          {dayjs(item?.birthday).format('MM-DD-YYYY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item?.contact}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <Text style={styles.noBirthdayText}>
                No Family Member's Birthday today
              </Text>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    backgroundColor: '#36413e',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 20,
    marginBottom: 20,
  },
  headings: {
    fontSize: 24,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 20,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#999',
    paddingBottom: 10,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noteTextView: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    width: '60%',
  },
  dates: {
    color: '#cccccc',
    fontWeight: '400',
    fontSize: 15,
  },
  noBirthdayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#cccccc',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default Birthdays;
