import {
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { contactUsFormApi, registerUser } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';
import Header from './Header';

const Register = ({ navigation }: any) => {
  const [loading, setLoading]: any = useState(false);
  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required('first name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('email is required'),
    message: Yup.string().required('message is required'),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.innerdiv}>
          <Formik
            initialValues={{
              full_name: '',
              email: '',
              message: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              setLoading(true);
              contactUsFormApi({
                body: {
                  full_name: values?.full_name,
                  email: values?.email,
                  message: values?.message,
                },
              })
                .then((res: any) => {
                  Toast.show({
                    type: 'success',
                    text1: res?.msg,
                  });
                  resetForm();
                  navigation.goBack();
                })
                .catch((err: any) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Enter a valid email address',
                  });
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
              <>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                  >
                    {loading && <Loader />}
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{ flex: 1 }}
                      contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 100,
                      }}
                      keyboardShouldPersistTaps="handled"
                    >
                      <Text style={styles.title}>Full Name</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your full name"
                          placeholderTextColor="#888"
                          value={values.full_name}
                          onChangeText={handleChange('full_name')}
                          onBlur={handleBlur('full_name')}
                        />
                      </View>
                      {touched.full_name && errors.full_name && (
                        <Text style={styles.errorText}>{errors.full_name}</Text>
                      )}

                      <Text style={styles.title}>Email</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your email"
                          placeholderTextColor="#888"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                        />
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}

                      <Text style={styles.title}>Message</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={{
                            ...styles.textInput,
                            textAlignVertical: 'top',
                            height: 100,
                          }}
                          placeholder="Enter your query"
                          placeholderTextColor="#888"
                          value={values.message}
                          onChangeText={handleChange('message')}
                          onBlur={handleBlur('message')}
                          multiline
                          blurOnSubmit={true}
                          returnKeyType="done"
                        />
                      </View>
                      {touched.message && errors.message && (
                        <Text style={styles.errorText}>{errors.message}</Text>
                      )}

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
              </>
            )}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#36413e',
  },
  container: {
    flex: 1,
    backgroundColor: '#36413e',
    paddingTop: 10,
  },
  innerdiv: {
    backgroundColor: '#bfb0a0',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 18,
    flex: 1,
    color: '#000',
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#36413e',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
