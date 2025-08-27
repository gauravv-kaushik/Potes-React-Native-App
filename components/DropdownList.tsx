import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { completeReminderApi } from '../apiStore/services';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const DropdownList = ({ title, data, expand }: any) => {
  const { triggerHomeReload } = useUser();
  const navigation: any = useNavigation();
  const [expanded, setExpanded] = useState(expand || false);

  const handleNavigate = useCallback(
    (item: any) => {
      navigation.navigate('AllNotesScreen', { notes_data: item });
    },
    [navigation],
  );

  const handleComplete = useCallback(
    (id: string) => {
      completeReminderApi({ query: { note_id: id } })
        .then((res: any) => {
          Toast.show({
            type: 'success',
            text1: res?.msg,
          });
          triggerHomeReload();
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: JSON.stringify(err),
          });
        });
    },
    [triggerHomeReload],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <TouchableOpacity
        style={styles.reminder}
        onPress={() => handleNavigate(item)}
      >
        <View style={styles.noteTextView}>
          <View style={styles.photoContainer}>
            {!item?.contact_photo ? (
              <Feather name="user" color="#fff" size={24} />
            ) : (
              <Image
                source={{ uri: item?.contact_photo }}
                style={styles.contactImage}
              />
            )}
          </View>
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {item?.contact_full_name}
            </Text>
            <Text style={styles.note} numberOfLines={2}>
              {item?.note}
            </Text>
          </View>
        </View>
        {title === 'Missed' && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => handleComplete(item?.id)}
          />
        )}
      </TouchableOpacity>
    ),
    [handleNavigate, handleComplete, title],
  );

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => setExpanded((prev: any) => !prev)}
        style={styles.headingView}
      >
        <Text style={styles.heading}>{title}</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{data?.length}</Text>
          </View>
          <FontAwesome
            name={expanded ? 'angle-up' : 'angle-down'}
            size={24}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item: any) => String(item?.id)}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10} // ✅ renders fewer items first
            maxToRenderPerBatch={10} // ✅ batch rendering
            windowSize={7} // ✅ keeps less items in memory
            removeClippedSubviews // ✅ unmounts invisible items
            getItemLayout={(_, index) => ({
              length: 70, // approximate row height for faster scroll
              offset: 70 * index,
              index,
            })}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#999',
    paddingBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#fff',
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
    height: '100%',
    width: '100%',
    borderRadius: 20,
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
    width: '80%',
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
    fontWeight: '600',
  },
  note: {
    fontSize: 15,
    marginBottom: 5,
    color: '#cccccc',
  },
  doneButton: {
    backgroundColor: 'gray',
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  countContainer: {
    backgroundColor: '#444',
    height: 20,
    width: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#cccccc',
    fontWeight: '600',
  },
});

export default DropdownList;
