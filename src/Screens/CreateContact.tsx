import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  MediaType,
  CameraOptions,
  launchCamera,
} from 'react-native-image-picker';
import dayjs from 'dayjs';
import {
  contactDetailApi,
  createContact,
  editContactApi,
} from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import { requestMediaPermissions } from '../../utils/permissions';

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

const CreateContact = ({ navigation, route }: any) => {
  const { contact_id } = route?.params ?? {};
  useEffect(() => {
    if (contact_id) {
      contactDetailApi({
        query: {
          id: contact_id,
        },
      })
        .then((res: any) => {
          setContact((prev: any) => ({
            ...prev,
            avatarUri: res?.photo || null,
            nameOrDescription: res?.full_name || '',
            birthday: res?.birthday || null,
            anniversary: res?.anniversary || null,
            email: res?.email || '',
            number: res?.phone || '',
            spouseName: res?.spouse_name || '',
            spouseBirthday: res?.spouse_birthday || null,
            spouseDetails: res?.spouse_details || '',
            children:
              (res.children || []).length > 0
                ? res?.children
                : [{ id: `child 1`, name: '', birthday: null, details: '' }],
            employmentHistory:
              (res?.previous_employers || []).length > 0
                ? res?.previous_employers
                : [{ id: `emp-${Date.now()}`, name: '', details: '' }],
            educationHistory:
              (res?.universities || []).length > 0
                ? res?.universities
                : [{ id: `edu-${Date.now()}`, name: '', details: '' }],
            interests:
              (res?.interests || []).length > 0
                ? res?.interests
                : [{ id: `int-${Date.now()}`, name: '' }],
            customFields: res?.custom_fields,
          }));
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: err?.data?.error,
          });
        });
    }
  }, []);

  const pickImage2 = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      quality: 1,
    };
    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setContact((prev: any) => ({
          ...prev,
          avatarUri: uri,
        }));
      }
    });
  };
  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Please allow Camera & Storage access',
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.2,
    };

    launchCamera(options, handleResponse);
  };

  const openGallery = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      Alert.alert('Permission required', 'Please allow Gallery access');
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.2,
      selectionLimit: 1,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleResponse = async (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setContact((prev: any) => ({
        ...prev,
        avatarUri: uri,
      }));
    }
  };

  const [showDatePicker, setShowDatePicker]: any = useState({
    show: false,
    path: [],
  });

  const [open, setOpen]: any = useState({
    personalInfo: true,
    familyDetails: false,
    employment: false,
    education: false,
    interests: false,
  });
  const [contact, setContact]: any = useState({
    avatarUri: null,
    nameOrDescription: '',
    birthday: null,
    anniversary: null,
    email: '',
    number: '',
    spouseName: '',
    spouseBirthday: null,
    spouseDetails: '',
    children: [{ id: `child 1`, name: '', birthday: null, details: '' }],
    employmentHistory: [{ id: `emp-${Date.now()}`, name: '', details: '' }],
    educationHistory: [{ id: `edu-${Date.now()}`, name: '', details: '' }],
    interests: [{ id: `int-${Date.now()}`, name: '' }],
    customFields: [],
  });

  const handleTextChange = (path: any, value: any) => {
    setContact((prev: any) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker({ show: false, path: [] });
    if (selectedDate) {
      setContact((prev: any) => {
        const newContact = JSON.parse(JSON.stringify(prev));
        let current = newContact;
        for (let i = 0; i < showDatePicker.path.length - 1; i++) {
          current = current[showDatePicker.path[i]];
        }
        current[showDatePicker.path[showDatePicker.path.length - 1]] =
          selectedDate.toISOString();
        return newContact;
      });
    }
  };

  const openDatePicker = (path: any) => {
    setShowDatePicker({ show: true, path: path });
  };

  const addItem = (field: any, structure: any) => {
    setContact((prev: any) => ({
      ...prev,
      [field]: [...prev[field], structure],
    }));
  };

  const removeItem = (field: any, id: any) => {
    setContact((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((item: any) => item.id !== id),
    }));
  };

  const addCustomField = () => {
    const newField = {
      id: `customField ${Date.now()}`,
      title: '',
      values: [''],
    };
    addItem('customFields', newField);
  };

  const removeCustomField = (id: any) => removeItem('customFields', id);

  const addCustomValue = (fieldIndex: any) => {
    setContact((prev: any) => {
      const newCustomFields = JSON.parse(JSON.stringify(prev.customFields));
      newCustomFields[fieldIndex].values.push('');
      return { ...prev, customFields: newCustomFields };
    });
  };

  const removeCustomValue = (fieldIndex: any, valueIndex: any) => {
    setContact((prev: any) => {
      const newCustomFields = JSON.parse(JSON.stringify(prev.customFields));
      newCustomFields[fieldIndex].values = newCustomFields[
        fieldIndex
      ].values.filter((v: any, index: any) => index !== valueIndex);
      return { ...prev, customFields: newCustomFields };
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('full_name', contact.nameOrDescription);
    if (contact.number) formData.append('phone', contact.number);
    if (contact.email) formData.append('email', contact.email);
    if (contact.birthday)
      formData.append('birthday', dayjs(contact.birthday).format('YYYY-MM-DD'));
    if (contact.anniversary)
      formData.append(
        'anniversary',
        dayjs(contact.anniversary).format('YYYY-MM-DD'),
      );
    if (contact.spouseName) formData.append('spouse_name', contact.spouseName);
    if (contact.spouseBirthday)
      formData.append(
        'spouse_birthday',
        dayjs(contact.spouseBirthday).format('YYYY-MM-DD'),
      );
    if (contact.spouseDetails)
      formData.append('spouse_details', contact.spouseDetails);
    if (contact.description)
      formData.append('description', contact.description);
    const formattedChildren = contact.children
      .map((child: any) => ({
        name: child.name?.trim() || null,
        birthday: child.birthday
          ? dayjs(child.birthday).format('YYYY-MM-DD')
          : null,
        details: child.details?.trim() || null,
      }))
      .filter((child: any) => child.name || child.birthday || child.details);
    formData.append('children', JSON.stringify(formattedChildren));
    const formattedEmployment = contact.employmentHistory
      .filter((emp: any) => emp.name?.trim())
      .map((emp: any) => ({
        name: emp.name.trim(),
        details: emp.details?.trim() || '',
      }));
    formData.append('previous_employers', JSON.stringify(formattedEmployment));
    const formattedEducation = contact.educationHistory
      .filter((edu: any) => edu.name?.trim())
      .map((edu: any) => ({
        name: edu.name.trim(),
        details: edu.details?.trim() || '',
      }));
    formData.append('universities', JSON.stringify(formattedEducation));
    const formattedInterests = contact.interests
      .filter((i: any) => i.name?.trim())
      .map((i: any) => ({ name: i.name.trim() }));
    formData.append('interests', JSON.stringify(formattedInterests));
    if (contact.avatarUri && !contact.avatarUri.includes('http')) {
      const uriParts = contact.avatarUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('photo', {
        uri: contact.avatarUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    // Custom Fields
    const filteredCustomFields = contact.customFields
      .map((cf: any) => ({
        title: cf.title.trim(),
        values: cf.values.filter((v: any) => v !== ''),
      }))
      .filter((cf: any) => cf.title !== '' && cf.values.length > 0);
    formData.append('custom_fields', JSON.stringify(filteredCustomFields));

    if (contact_id) {
      editContactApi({
        body: formData,
        query: {
          id: contact_id,
        },
      })
        .then((res: any) => {
          Toast.show({
            type: 'success',
            text1: res?.msg,
          });
          navigation.goBack();
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: err?.data?.error || 'Something went wrong',
          });
        });
    } else {
      createContact({
        body: formData,
      })
        .then((res: any) => {
          Toast.show({
            type: 'success',
            text1: res?.msg,
          });
          navigation.navigate('Main');
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: err?.data?.error || 'Something went wrong',
          });
        });
    }
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
          <View style={styles.imgContainer}>
            <View style={styles.imgDiv}>
              <Image
                source={
                  contact.avatarUri
                    ? {
                        uri: contact.avatarUri,
                      }
                    : require('../../assets/userAvatar.png')
                }
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.camera} onPress={pickImage}>
                <Feather name="camera" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

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
              <TextInput
                style={styles.textInput}
                placeholder="Enter name or description"
                placeholderTextColor="#888"
                value={contact.nameOrDescription}
                onChangeText={text =>
                  handleTextChange(['nameOrDescription'], text)
                }
              />
              <Text style={styles.title}>Birthday</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => openDatePicker(['birthday'])}
              >
                <Text style={styles.dateText}>
                  {contact.birthday
                    ? dayjs(contact.birthday).format('MM-DD-YYYY')
                    : 'Select Birthday'}
                </Text>
                <Feather name="calendar" size={20} color="#555" />
              </TouchableOpacity>
              <Text style={styles.title}>Anniversary</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => openDatePicker(['anniversary'])}
              >
                <Text style={styles.dateText}>
                  {contact.anniversary
                    ? dayjs(contact.anniversary).format('MM-DD-YYYY')
                    : 'Select Anniversary'}
                </Text>
                <Feather name="calendar" size={20} color="#555" />
              </TouchableOpacity>
              <Text style={styles.title}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email"
                placeholderTextColor="#888"
                value={contact.email}
                onChangeText={text => handleTextChange(['email'], text)}
              />
              <Text style={styles.title}>Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={contact.number}
                maxLength={10}
                onChangeText={text => handleTextChange(['number'], text)}
              />
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
                  backgroundColor: '#36413e',
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <Text style={styles.title}>Spouse Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter spouse name"
                  placeholderTextColor="#888"
                  value={contact.spouseName}
                  onChangeText={text => handleTextChange(['spouseName'], text)}
                />
                <Text style={styles.title}>Spouse Birthday</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => openDatePicker(['spouseBirthday'])}
                >
                  <Text style={styles.dateText}>
                    {contact.spouseBirthday
                      ? dayjs(contact.spouseBirthday).format('MM-DD-YYYY')
                      : 'Select Spouse Birthday'}
                  </Text>
                  <Feather name="calendar" size={20} color="#555" />
                </TouchableOpacity>
                <Text style={styles.title}>Spouse Details</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Enter spouse details"
                  placeholderTextColor="#888"
                  multiline
                  value={contact.spouseDetails}
                  onChangeText={text =>
                    handleTextChange(['spouseDetails'], text)
                  }
                  blurOnSubmit={true}
                  returnKeyType="done"
                />
              </View>

              {contact.children.map((child: any, index: any) => (
                <View key={index} style={styles.dynamicItemContainer}>
                  <View style={styles.dynamicItemHeader}>
                    <Text style={styles.subHeadingText}>
                      Family Member {index + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeItem('children', child.id)}
                    >
                      <Feather name="trash-2" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.title}>Family Member Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter family member name"
                    placeholderTextColor="#888"
                    value={child.name}
                    onChangeText={text =>
                      handleTextChange(['children', index, 'name'], text)
                    }
                  />
                  <Text style={styles.title}>Family Member Birthday</Text>
                  <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() =>
                      openDatePicker(['children', index, 'birthday'])
                    }
                  >
                    <Text style={styles.dateText}>
                      {child.birthday
                        ? dayjs(child.birthday).format('MM-DD-YYYY')
                        : 'Select Family Member Birthday'}
                    </Text>
                    <Feather name="calendar" size={20} color="#555" />
                  </TouchableOpacity>
                  <Text style={styles.title}>Family Member Details</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Enter family member details"
                    placeholderTextColor="#888"
                    multiline
                    value={child.details}
                    onChangeText={text =>
                      handleTextChange(['children', index, 'details'], text)
                    }
                    blurOnSubmit={true}
                    returnKeyType="done"
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  addItem('children', {
                    id: `child ${contact.children.length + 1}`,
                    name: '',
                    birthday: null,
                    details: '',
                  })
                }
              >
                <Text style={styles.addButtonText}>+ Add Family Member</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Other sections would follow a similar pattern... */}
          {/* --- Employment --- */}
          <ClosableHeader
            setState={setOpen}
            state={open}
            stateKey="employment"
            heading="Employment"
          />
          {open.employment && (
            <View style={styles.section}>
              {contact.employmentHistory.map((item: any, index: any) => (
                <View key={index} style={styles.dynamicItemContainer}>
                  <View style={styles.dynamicItemHeader}>
                    <Text style={styles.subHeadingText}>Employment</Text>
                    <TouchableOpacity
                      onPress={() => removeItem('employmentHistory', item.id)}
                    >
                      <Feather name="trash-2" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.title}>Employer Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter employer name"
                    placeholderTextColor="#888"
                    value={item.name}
                    onChangeText={text =>
                      handleTextChange(
                        ['employmentHistory', index, 'name'],
                        text,
                      )
                    }
                  />
                  <Text style={styles.title}>Employer Details</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Enter employer details"
                    placeholderTextColor="#888"
                    multiline
                    value={item.details}
                    onChangeText={text =>
                      handleTextChange(
                        ['employmentHistory', index, 'details'],
                        text,
                      )
                    }
                    blurOnSubmit={true}
                    returnKeyType="done"
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  addItem('employmentHistory', {
                    id: `emp-${Date.now()}`,
                    name: '',
                    details: '',
                  })
                }
              >
                <Text style={styles.addButtonText}>+ Add employer</Text>
              </TouchableOpacity>
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
              {contact.educationHistory.map((item: any, index: any) => (
                <View key={index} style={styles.dynamicItemContainer}>
                  <View style={styles.dynamicItemHeader}>
                    <Text style={styles.subHeadingText}>Education</Text>
                    <TouchableOpacity
                      onPress={() => removeItem('educationHistory', item.id)}
                    >
                      <Feather name="trash-2" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.title}>University Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter university name"
                    placeholderTextColor="#888"
                    value={item.name}
                    onChangeText={text =>
                      handleTextChange(
                        ['educationHistory', index, 'name'],
                        text,
                      )
                    }
                  />
                  <Text style={styles.title}>University Details</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Enter university details"
                    placeholderTextColor="#888"
                    multiline
                    value={item.details}
                    onChangeText={text =>
                      handleTextChange(
                        ['educationHistory', index, 'details'],
                        text,
                      )
                    }
                    blurOnSubmit={true}
                    returnKeyType="done"
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  addItem('educationHistory', {
                    id: `edu-${Date.now()}`,
                    name: '',
                    details: '',
                  })
                }
              >
                <Text style={styles.addButtonText}>+ Add education</Text>
              </TouchableOpacity>
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
                backgroundColor: '#36413e',
                padding: 15,
                borderRadius: 10,
              }}
            >
              {contact.interests.map((item: any, index: any) => (
                <View key={index} style={styles.interestItemContainer}>
                  <TextInput
                    style={styles.interestInput}
                    placeholder="Enter an interest"
                    placeholderTextColor="#888"
                    value={item.name}
                    onChangeText={text =>
                      handleTextChange(['interests', index, 'name'], text)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => removeItem('interests', item.id)}
                  >
                    <Feather name="trash-2" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  addItem('interests', { id: `int-${Date.now()}`, name: '' })
                }
              >
                <Text style={{ ...styles.addButtonText, color: '#fff' }}>
                  + Add interest
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Custom Fields --- */}
          <View style={styles.section}>
            {contact.customFields.map((field: any, fieldIndex: any) => (
              <View key={fieldIndex} style={styles.dynamicItemContainer}>
                <View style={styles.dynamicItemHeader}>
                  <TextInput
                    style={[styles.textInput, { flex: 1, marginRight: 10 }]}
                    placeholder="Custom Field Title"
                    placeholderTextColor="#888"
                    value={field.title}
                    onChangeText={text =>
                      handleTextChange(
                        ['customFields', fieldIndex, 'title'],
                        text,
                      )
                    }
                  />
                  <TouchableOpacity onPress={() => removeCustomField(field.id)}>
                    <Feather name="trash-2" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
                {field.values.map((val: any, valueIndex: any) => (
                  <View key={valueIndex} style={styles.interestItemContainer}>
                    <TextInput
                      style={styles.interestInput}
                      placeholder="Enter value"
                      placeholderTextColor="#888"
                      value={val}
                      onChangeText={text =>
                        handleTextChange(
                          ['customFields', fieldIndex, 'values', valueIndex],
                          text,
                        )
                      }
                    />
                    <TouchableOpacity
                      onPress={() => removeCustomValue(fieldIndex, valueIndex)}
                    >
                      <Feather name="trash-2" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addCustomValue(fieldIndex)}
                >
                  <Text style={{ ...styles.addButtonText, color: '#fff' }}>
                    + Add value for "{field.title || `Field ${fieldIndex + 1}`}"
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={addCustomField}
            >
              <Text style={styles.actionButtonText}>Add Custom Field</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>

          {showDatePicker.show && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateContact;

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
  imgContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imgDiv: {
    position: 'relative',
  },
  avatar: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  camera: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
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
    fontSize: 17,
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
  inputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#000',
    marginVertical: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  dynamicItemContainer: {
    backgroundColor: '#36413e',
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
  addButton: {
    marginTop: 15,
    paddingLeft: 5,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#2d3a3a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  interestItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  interestInput: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  actionButton: {
    backgroundColor: '#36413e',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  removeButton: { backgroundColor: '#808080' },
});
