import {
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from 'react-native-vector-icons/Feather';
import { deleteNoteApi, getAllNotesApi } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';

const AllNotesScreen = ({ navigation, route }: any) => {
  const { contact_id, notes_data } = route?.params ?? {};
  const [modalVisible, setModalVisible] = useState(false);
  const [notesData, setNotesData]: any = useState([]);
  const [deleteNoteId, setDeleteNoteId]: any = useState(0);
  const [loading, setLoading]: any = useState(false);
  const getAllNotes = () => {
    if (contact_id) {
      setLoading(true);
      getAllNotesApi({
        query: {
          id: contact_id,
        },
      })
        .then((res: any) => {
          setNotesData(res);
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: 'something went wrong',
          });
        })
        .finally(() => setLoading(false));
    }
  };
  useEffect(() => {
    getAllNotes();
  }, []);
  useFocusEffect(
    useCallback(() => {
      getAllNotes();
    }, [contact_id]),
  );
  const handleNoteDelete = () => {
    deleteNoteApi({
      query: {
        id: deleteNoteId,
      },
    })
      .then((res: any) => {
        Toast.show({
          type: 'success',
          text1: res?.msg,
        });
        getAllNotes();
        setModalVisible(false);
        if (notes_data) {
          navigation.goBack();
        }
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: err?.data?.error,
        });
        setModalVisible(false);
      });
  };
  const Note = ({ item }: any) => {
    return (
      <View style={styles.noteContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={[styles.leftProfile, { flex: 1 }]}
            onPress={() =>
              navigation.navigate('ViewContact', { contact_id: item?.contact })
            }
          >
            <View style={styles.photoContainer}>
              {!item?.contact_photo ? (
                <Feather name="user" color="#fff" size={24} />
              ) : (
                <Image
                  source={{ uri: item?.contact_photo }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                  }}
                />
              )}
            </View>
            <Text
              style={styles.contactName}
              numberOfLines={6}
              ellipsizeMode="tail"
            >
              {item?.contact_full_name}
            </Text>
          </TouchableOpacity>

          <View style={[styles.leftProfile, { flexShrink: 0 }]}>
            <TouchableOpacity
              onPress={() => {
                setDeleteNoteId(item?.id);
                setModalVisible(true);
              }}
            >
              <Feather name="trash-2" size={22} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateNote', { item })}
            >
              <Feather name="edit-2" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </View>

        {item?.reminder && (
          <View style={styles.reminderDate}>
            <Feather name="bell" size={15} color="#000" />
            <Text style={styles.reminderText}>
              {dayjs(item?.reminder).format('MM-DD-YYYY')}
            </Text>
          </View>
        )}

        <Text style={styles.noteText}>{item?.note}</Text>

        {item?.created_date && (
          <View
            style={{
              ...styles.reminderDate,
              justifyContent: 'flex-end',
              marginTop: 10,
            }}
          >
            <Text style={styles.createdDate}>Note created at</Text>
            <Feather name="clock" size={14} color="#666" />
            <Text style={styles.createdDate}>
              {dayjs(item?.created_date).format('MM-DD-YYYY')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#36413e' }}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Header navigation={navigation} left="back" from="stack" />
        <View style={styles.innerdiv}>
          {loading && <Loader />}

          {notes_data ? (
            <Note item={notes_data} />
          ) : (
            <FlatList
              data={notesData}
              renderItem={({ item }: any) => <Note item={item} />}
              keyExtractor={item => item?.id}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          )}
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
                  Are you sure you want to delete this note ?
                </Text>
                <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonDelete]}
                    onPress={handleNoteDelete}
                  >
                    <Text style={styles.textStyle}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingTop: 30,
    paddingHorizontal: 10,
    flex: 1,
    gap: 10,
  },
  noteContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  contactName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
  },
  reminderDate: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 2,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111',
  },
  createdDate: { color: '#777', fontSize: 13, fontWeight: '600' },
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

export default AllNotesScreen;
