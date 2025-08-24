import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createNoteApi,
  editNoteApi,
  getContactsName,
} from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

const reminderOptions = ['None', 'Monthly', 'Quarterly', 'Yearly', 'Custom'];

const CreateNote = ({ navigation, route }: any) => {
  const item = route?.params?.item ?? null;
  const { contact_id, contact_name } = route?.params ?? {};
  const [contactNames, setContactNames]: any = useState([]);
  const [note, setNote] = useState({
    contactName: item?.contact_full_name || contact_name || 'select contact',
    contact: item?.contact || contact_id || 0,
    noteText: item?.note || '',
    reminder_type: item?.reminder_type || 'None',
    reminder: item?.reminder || null,
  });

  const [errors, setErrors] = useState<{ noteText?: string; contact?: any }>(
    {},
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isContactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [isReminderDropdownOpen, setReminderDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNote((prev: any) => ({
        ...prev,
        reminder: selectedDate.toISOString(),
      }));
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
    Keyboard.dismiss();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'MM-DD-YYYY';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
  };

  const handleSubmit = () => {
    const newErrors: { noteText?: string; contact?: any } = {};
    if (!note.noteText.trim()) {
      newErrors.noteText = 'Note text is required';
    }
    if (!note.contact || note.contact == 0) {
      newErrors.contact = 'Please select a contact';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const body = {
        contact: note?.contact,
        note: note?.noteText,
        reminder_type:
          note?.reminder_type === 'None' ? null : note?.reminder_type,
        reminder: note?.reminder
          ? dayjs(note?.reminder).format('YYYY-MM-DD')
          : null,
      };
      if (item) {
        editNoteApi({
          body,
          query: {
            id: item?.id,
          },
        })
          .then((res: any) => {
            Toast.show({
              type: 'success',
              text1: 'Note edited successfully',
            });
            if (item?.editFrom === 'home') {
              navigation.navigate('Main');
            } else {
              navigation.goBack();
            }
          })
          .catch((err: any) => {
            Toast.show({
              type: 'error',
              text1: JSON.stringify(err),
            });
          });
      } else {
        createNoteApi({
          body,
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
      }
    }
  };

  const filteredContacts = contactNames.filter((contact: any) =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    getContactsName()
      .then((res: any) => {
        setContactNames(res?.contacts);
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: err?.data?.details,
        });
      });
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <Header navigation={navigation} left="back" from="stack" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Contact Name</Text>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setContactDropdownOpen(!isContactDropdownOpen)}
            >
              <Text style={styles.dropdownSelectorText}>
                {note.contactName}
              </Text>
              <Feather
                name={isContactDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            {errors.contact && (
              <Text style={styles.errorText}>{errors.contact}</Text>
            )}
            {isContactDropdownOpen && (
              <View style={styles.dropdownArea}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  placeholderTextColor="#888"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                <FlatList
                  data={filteredContacts}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNote({
                          ...note,
                          contactName: item?.full_name,
                          contact: item?.id,
                        });
                        setContactDropdownOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      <Text style={{ color: '#000' }}>{item.full_name}</Text>
                    </TouchableOpacity>
                  )}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            <Text style={styles.label}>Enter the Note</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter your note"
              placeholderTextColor="#888"
              value={note.noteText}
              onChangeText={text => setNote({ ...note, noteText: text })}
              multiline
              blurOnSubmit={true}
              returnKeyType="done"
            />
            {errors.noteText && (
              <Text style={styles.errorText}>{errors.noteText}</Text>
            )}

            <Text style={styles.label}>Note reminder</Text>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setReminderDropdownOpen(!isReminderDropdownOpen)}
            >
              <Text style={styles.dropdownSelectorText}>
                {note.reminder_type}
              </Text>
              <Feather
                name={isReminderDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            {isReminderDropdownOpen && (
              <View style={styles.dropdownArea}>
                <FlatList
                  data={reminderOptions}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNote({ ...note, reminder_type: item });
                        setReminderDropdownOpen(false);
                      }}
                    >
                      <Text style={{ color: '#333' }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Set a Reminder */}
            {note.reminder_type === 'Custom' && (
              <>
                <Text style={styles.label}>Set a Reminder</Text>
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={styles.dateInput}
                >
                  <Text style={styles.dateText}>
                    {formatDate(note.reminder)}
                  </Text>
                  <Feather name="calendar" size={20} color="#333" />
                </TouchableOpacity>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={note.reminder ? new Date(note.reminder) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateNote;

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
    backgroundColor: '#bfb0a0', // Dark charcoal color from image
    paddingBottom: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#36413e', // Dark grey form background
    borderRadius: 15,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  dropdownSelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  dropdownSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#000',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff4d4d',
    marginTop: 5,
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#36413e',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
