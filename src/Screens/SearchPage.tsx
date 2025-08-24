import {
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import { searchApi } from '../../apiStore/services';
import SearchResultComponent from '../../components/searchResultComponent';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../../components/Loader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFocusEffect } from '@react-navigation/native';

const SearchPage = ({ navigation }: any) => {
  const [searchResult, setSearchResult]: any = useState({});
  const [loading, setLoading]: any = useState(false);
  const formikRef = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  const validationSchema = Yup.object().shape({
    searchBox: Yup.string()
      .required('Please type something')
      .test(
        'is-not-blank',
        'Please type something',
        value => !!value && value.trim().length > 0,
      ),
  });
  useFocusEffect(
    useCallback(() => {
      // if (formikRef.current) {
      //   formikRef.current.resetForm();
      // }

      const timer = setTimeout(() => {
        if (Object.keys(searchResult).length === 0) {
          inputRef.current?.focus();
        } else {
          Keyboard.dismiss();
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [searchResult]),
  );

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return <Text style={styles.mainText}>{text}</Text>;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text style={styles.mainText}>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    );
  };

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
          <Formik
            innerRef={formikRef}
            initialValues={{
              searchBox: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              setQuery(values?.searchBox);
              searchApi({
                query: {
                  q: values.searchBox,
                },
              })
                .then((res: any) => {
                  setSearchResult(res);
                  Keyboard.dismiss();
                })
                .finally(() => setLoading(false));
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }: any) => (
              <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
                  <TextInput
                    ref={inputRef}
                    style={styles.searchbar}
                    placeholder="Search..."
                    placeholderTextColor="#555"
                    value={values.searchBox}
                    onChangeText={handleChange('searchBox')}
                    onBlur={handleBlur('searchBox')}
                    returnKeyType="search"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={handleSubmit}>
                    <Feather name="search" size={22} color="#000" />
                  </TouchableOpacity>
                </View>
                {/* {touched.searchBox && errors.searchBox && (
                  <Text style={styles.errorText}>{errors.searchBox}</Text>
                )} */}
              </View>
            )}
          </Formik>

          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* contacts */}
            {searchResult?.contacts?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Contacts</Text>
                {searchResult?.contacts?.map((item: any, index: any) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate('ViewContact', {
                        contact_id: item?.id,
                      })
                    }
                  >
                    <View style={styles.mainContent}>
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
                      <Text style={styles.mainText}>
                        {getHighlightedText(item?.full_name, query)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Notes */}
            {searchResult?.notes?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Notes</Text>
                {searchResult?.notes?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.contact?.id}
                    photo={item?.contact?.photo}
                    name={item?.contact?.full_name}
                    content={item?.note}
                    query={query}
                  />
                ))}
              </View>
            )}
            {/* spouse */}
            {searchResult?.spouse?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Spouse</Text>
                {searchResult?.spouse?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.id}
                    photo={item?.photo}
                    name={item?.full_name}
                    content={item?.spouse_name}
                    query={query}
                  />
                ))}
              </View>
            )}
            {/* children */}
            {searchResult?.childs?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Family Member</Text>
                {searchResult?.childs?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.id}
                    photo={item?.photo}
                    name={item?.full_name}
                    content={item?.child_name}
                    query={query}
                  />
                ))}
              </View>
            )}
            {/* employers */}
            {searchResult?.employers?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Employers</Text>
                {searchResult?.employers?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.id}
                    photo={item?.photo}
                    name={item?.full_name}
                    content={item?.employer_name}
                    query={query}
                  />
                ))}
              </View>
            )}
            {/* universities */}
            {searchResult?.universities?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Universities</Text>
                {searchResult?.universities?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.id}
                    photo={item?.photo}
                    name={item?.full_name}
                    content={item?.university}
                    query={query}
                  />
                ))}
              </View>
            )}
            {/* interests */}
            {searchResult?.interests?.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.subHeading}>Interests</Text>
                {searchResult?.interests?.map((item: any, index: any) => (
                  <SearchResultComponent
                    key={index}
                    id={item?.id}
                    photo={item?.photo}
                    name={item?.full_name}
                    content={item?.interest}
                    query={query}
                  />
                ))}
              </View>
            )}
            {searchResult?.contacts?.length === 0 &&
              searchResult?.spouse?.length === 0 &&
              searchResult?.childs?.length === 0 &&
              searchResult?.employers?.length === 0 &&
              searchResult?.interests?.length === 0 &&
              searchResult?.universities?.length === 0 &&
              searchResult?.notes?.length === 0 && (
                <View style={styles.noResultContainer}>
                  <Text style={styles.mainText}>No search result found</Text>
                </View>
              )}
          </ScrollView>

          <View />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36413e',
    alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
  topview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    paddingHorizontal: 10,
  },
  potesTextImage: {
    height: '100%',
    width: '40%',
    objectFit: 'contain',
  },
  innerdiv: {
    backgroundColor: '#bfb0a0',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    // marginBottom: 30,
  },
  searchbar: {
    color: '#000',
    width: '80%',
    fontSize: 20,
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'center',
  },
  resultContainer: {
    backgroundColor: '#36413e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  subHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  mainText: {
    color: '#fff',
    fontSize: 16,
  },
  smallText: {
    color: '#999',
    fontSize: 12,
  },
  noResultContainer: {
    backgroundColor: '#36413e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    backgroundColor: 'yellow',
    color: '#000',
  },
});
