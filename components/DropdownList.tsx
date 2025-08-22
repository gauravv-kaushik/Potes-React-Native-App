import React, { useState } from 'react';
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
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.headingView}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: '#fff',
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={styles.countContainer}>
            <Text style={{ color: '#999', fontWeight: '600' }}>
              {data?.length}
            </Text>
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
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.reminder}
                onPress={() =>
                  navigation.navigate('AllNotesScreen', {
                    notes_data: item,
                  })
                }
              >
                <View style={styles.noteTextView}>
                  <View style={styles.photoContainer}>
                    {!item?.contact_photo ? (
                      <Feather name="user" color="#fff" size={24} />
                    ) : (
                      <Image
                        source={{
                          uri: item?.contact_photo,
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
                        color: '#fff',
                        fontWeight: '600',
                      }}
                      numberOfLines={1}
                    >
                      {item?.contact_full_name}
                    </Text>
                    <Text
                      style={{ fontSize: 15, marginBottom: 5, color: '#999' }}
                      numberOfLines={2}
                    >
                      {item?.note}
                    </Text>
                  </View>
                </View>
                {title === 'Missed' && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => {
                      completeReminderApi({ query: { note_id: item?.id } })
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
                    }}
                  ></TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
    width: '80%',
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
});

export default DropdownList;
