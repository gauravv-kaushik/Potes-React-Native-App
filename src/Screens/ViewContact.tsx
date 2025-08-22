import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { contactDetailApi, deleteContactApi } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const ClosableHeader = ({ setState, state, stateKey, heading }: any) => {
  return (
    <TouchableOpacity
      onPress={() =>
        setState((prev: any) => ({
          ...prev,
          [stateKey]: !prev[stateKey],
        }))
      }
    >
      <View style={styles.headingView}>
        <Text style={styles.headingText}>{heading}</Text>
        <Feather
          name={state[stateKey] ? 'minus' : 'plus'}
          size={24}
          color="#000"
        />
      </View>
    </TouchableOpacity>
  );
};

const ViewContact = ({ navigation, route }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { contact_id } = route?.params;
  const [open, setOpen]: any = useState({
    personalInfo: true,
    familyDetails: false,
    employment: false,
    education: false,
    interests: false,
    customField: false,
  });
  const [expand, setExpand]: any = useState(false);
  const [contactDetail, setContactDetail]: any = useState({});
  const handleExpand = () => {
    setExpand((prev: any) => !prev);
    setOpen({
      personalInfo: !expand,
      familyDetails: !expand,
      employment: !expand,
      education: !expand,
      interests: !expand,
      customField: !expand,
    });
  };

  const getContactDetail = () => {
    contactDetailApi({
      query: {
        id: contact_id,
      },
    })
      .then((res: any) => {
        setContactDetail(res);
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: err?.data?.error,
        });
      });
  };

  useEffect(() => {
    getContactDetail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getContactDetail();
    }, [contact_id]),
  );

  const handleDeleteContact = () => {
    deleteContactApi({
      query: {
        id: contact_id,
      },
    })
      .then((res: any) => {
        Toast.show({
          type: 'success',
          text1: res?.msg,
        });
        setModalVisible(false);
        navigation.goBack();
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: err?.data?.error,
        });
        setModalVisible(false);
      });
  };
  const formatPhone = (phone: any) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <Header navigation={navigation} left="back" from="stack" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="trash-2" size={20} color="#fff" />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() =>
                navigation.navigate('CreateContact', { contact_id })
              }
            >
              <Feather name="edit-2" size={20} color="#fff" />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                navigation.navigate('CreateNote', {
                  contact_id: contactDetail?.id,
                  contact_name: contactDetail?.full_name,
                });
              }}
            >
              <Octicons name="file" size={20} color="#fff" />
              <Text style={styles.optionText}>Add Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleExpand}>
              {expand ? (
                <>
                  <FontAwesome name="compress" size={20} color="#fff" />
                  <Text style={styles.optionText}>Collapse -</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="expand" size={20} color="#fff" />
                  <Text style={styles.optionText}>Expand +</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.photoContainer}>
            {!contactDetail?.photo ? (
              <Feather name="user" color="#fff" size={70} />
            ) : (
              <Image
                source={{
                  uri: contactDetail?.photo,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 100,
                }}
              />
            )}
          </View>
          <Text style={styles.fullName}>{contactDetail?.full_name}</Text>

          {/* Personal Information */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="personalInfo"
            heading="Personal information"
          />
          {open.personalInfo && (
            <View
              style={{
                ...styles.section,
                backgroundColor: '#42534e',
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text style={styles.title}>Name or Description</Text>
              <Text style={styles.values}>{contactDetail?.full_name}</Text>
              <Text style={styles.title}>Birthday</Text>
              <Text style={styles.values}>
                {contactDetail?.birthday
                  ? dayjs(contactDetail?.birthday).format('MM-DD-YYYY')
                  : '-'}
              </Text>
              <Text style={styles.title}>Anniversary</Text>
              <Text style={styles.values}>
                {contactDetail?.anniversary
                  ? dayjs(contactDetail?.anniversary).format('MM-DD-YYYY')
                  : '-'}
              </Text>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.values}>{contactDetail?.email || '-'}</Text>
              <Text style={styles.title}>Number</Text>
              <Text style={styles.values}>
                {formatPhone(contactDetail?.phone) || '-'}
              </Text>
            </View>
          )}

          {/* Family Details */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="familyDetails"
            heading="Family Details"
          />
          {open.familyDetails && (
            <View style={styles.section}>
              <View
                style={{
                  backgroundColor: '#42534e',
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <Text style={styles.title}>Spouse Name</Text>
                <Text style={styles.values}>
                  {contactDetail?.spouse_name || '-'}
                </Text>
                <Text style={styles.title}>Spouse Birthday</Text>
                <Text style={styles.values}>
                  {contactDetail?.spouse_birthday
                    ? dayjs(contactDetail?.spouse_birthday).format('MM-DD-YYYY')
                    : '-'}
                </Text>
                <Text style={styles.title}>Spouse Details</Text>
                <Text style={styles.values}>
                  {contactDetail?.spouse_details || '-'}
                </Text>
              </View>

              {contactDetail?.children?.length > 0 ? (
                contactDetail?.children?.map((child: any, index: any) => (
                  <View key={child.id} style={styles.dynamicItemContainer}>
                    <View style={styles.dynamicItemHeader}>
                      <Text style={styles.subHeadingText}>Family Member</Text>
                    </View>
                    <Text style={styles.title}>Family Member Name</Text>
                    <Text style={styles.values}>{child?.name || '-'}</Text>
                    <Text style={styles.title}>Family Member Birthday</Text>
                    <Text style={styles.values}>
                      {child?.birthday
                        ? dayjs(child?.birthday).format('MM-DD-YYYY')
                        : '-'}
                    </Text>
                    <Text style={styles.title}>Family Member Details</Text>
                    <Text style={styles.values}>{child?.details || '-'}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.dynamicItemContainer}>
                  <Text style={styles.noContent}>
                    No Family Member details added.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* --- Employment --- */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="employment"
            heading="Employment"
          />
          {open.employment && (
            <View style={styles.section}>
              {contactDetail?.previous_employers.length > 0 ? (
                contactDetail?.previous_employers?.map(
                  (item: any, index: any) => (
                    <View key={item.id} style={styles.dynamicItemContainer}>
                      <View style={styles.dynamicItemHeader}>
                        <Text style={styles.subHeadingText}>Employment</Text>
                      </View>
                      <Text style={styles.title}>Employer Name</Text>
                      <Text style={styles.values}>{item?.name || '-'}</Text>
                      <Text style={styles.title}>Employer Details</Text>
                      <Text style={styles.values}>{item?.details || '-'}</Text>
                    </View>
                  ),
                )
              ) : (
                <View style={styles.dynamicItemContainer}>
                  <Text style={styles.noContent}>
                    No employment details added.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* --- Education --- */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="education"
            heading="Education"
          />
          {open.education && (
            <View style={styles.section}>
              {contactDetail?.universities?.length > 0 ? (
                contactDetail?.universities?.map((item: any, index: any) => (
                  <View key={item.id} style={styles.dynamicItemContainer}>
                    <View style={styles.dynamicItemHeader}>
                      <Text style={styles.subHeadingText}>Education</Text>
                    </View>
                    <Text style={styles.title}>University Name</Text>
                    <Text style={styles.values}>{item?.name || '-'}</Text>

                    <Text style={styles.title}>University Details</Text>
                    <Text style={styles.values}>{item?.details || '-'}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.dynamicItemContainer}>
                  <Text style={styles.noContent}>
                    No education details added.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* --- Interests --- */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="interests"
            heading="Interests"
          />
          {open.interests && (
            <View
              style={{
                ...styles.section,
                backgroundColor: '#42534e',
                borderRadius: 10,
                marginTop: 15,
                padding: 15,
              }}
            >
              {contactDetail?.interests?.length > 0 && (
                <Text style={styles.subHeadingText}>Interests</Text>
              )}
              {contactDetail?.interests?.length > 0 ? (
                contactDetail?.interests?.map((item: any, index: any) => (
                  <View key={item.id} style={styles.interestItemContainer}>
                    <Text style={styles.values}>{`o  ${item?.name}`}</Text>
                  </View>
                ))
              ) : (
                <View>
                  <Text style={styles.noContent}>No interests added.</Text>
                </View>
              )}
            </View>
          )}

          {/* --- Custom Fields --- */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="customField"
            heading="Others (Custom Fields)"
          />
          {open.customField && (
            <View style={styles.section}>
              {contactDetail?.custom_fields?.length > 0 ? (
                contactDetail?.custom_fields?.map(
                  (field: any, fieldIndex: any) => (
                    <View key={fieldIndex} style={styles.dynamicItemContainer}>
                      <View style={styles.dynamicItemHeader}>
                        <Text style={styles.title}>{field.title}</Text>
                      </View>
                      {field?.values?.map((val: any, valueIndex: any) => (
                        <View
                          key={valueIndex}
                          style={styles.interestItemContainer}
                        >
                          <Text style={styles.values}>{`o  ${val}`}</Text>
                        </View>
                      ))}
                    </View>
                  ),
                )
              ) : (
                <View style={styles.dynamicItemContainer}>
                  <Text style={styles.noContent}>No custom fields added.</Text>
                </View>
              )}
            </View>
          )}
          <View style={styles?.contactNotesFive}>
            <View style={styles?.fiveNotesHeading}>
              <Text style={styles.headingText}>Notes</Text>
              {contactDetail?.contact_notes?.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AllNotesScreen', {
                      contact_id: contactDetail?.id,
                    });
                  }}
                >
                  <Text style={styles.allNotesText}>
                    All Notes{' '}
                    <Feather
                      name="arrow-right-circle"
                      size={15}
                      color="#36413e"
                    />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {contactDetail?.contact_notes?.length > 0 ? (
              contactDetail?.contact_notes?.map((item: any, idx: any) => (
                <View key={idx} style={styles.noteContainer}>
                  {item?.reminder && (
                    <Text style={styles.reminderDate}>
                      <Feather name="bell" size={15} color="#000" />
                      {'  '}
                      {dayjs(item?.reminder).format('MM-DD-YYYY')}
                    </Text>
                  )}
                  <Text style={styles.noteText}>{item?.note}</Text>
                  {item?.created_date && (
                    <Text style={styles.createdAt}>
                      Note Created at{' '}
                      {dayjs(item?.created_date).format('MM-DD-YYYY')}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: '#999', fontSize: 14 }}>
                  No notes for this contact
                </Text>
              </View>
            )}
          </View>
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
                  Are you sure you want to delete this contact ?
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
                    onPress={handleDeleteContact}
                  >
                    <Text style={styles.textStyle}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ViewContact;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#36413e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#bfb0a0',
    paddingHorizontal: 10,
    paddingBottom: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#36413e',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 12,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 140,
    width: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 3,
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5a5a',
    marginBottom: 10,
  },
  headingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subHeadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    marginTop: 10,
    fontWeight: '500',
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },

  dynamicItemContainer: {
    backgroundColor: '#42534e',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  dynamicItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  interestItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  values: {
    color: '#e0e0e0',
    marginLeft: 5,
  },
  contactNotesFive: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  fiveNotesHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allNotesText: {
    color: '#36413e',
    fontSize: 14,
    fontWeight: '600',
  },
  noteContainer: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  reminderDate: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
    color: '#000',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111',
    marginLeft: 5,
  },
  createdAt: {
    color: '#777',
    alignSelf: 'flex-end',
    fontSize: 13,
    fontWeight: '600',
  },
  noContent: {
    fontSize: 14,
    color: '#999',
    alignSelf: 'center',
    fontStyle: 'italic',
    marginVertical: 10,
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
