import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPasswordSendOTP } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import Loader from '../../components/Loader';

const ForgotPassword = ({ navigation }: any) => {
  const [loading, setLoading]: any = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('email is required'),
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            setLoading(true);
            forgotPasswordSendOTP({
              body: {
                email: values?.email,
              },
            })
              .then((res: any) => {
                Toast.show({
                  type: 'success',
                  text1: res.msg,
                });
                navigation.navigate('ForgotPasswordOTP', {
                  email: values?.email,
                });
              })
              .catch((err: any) => {
                Toast.show({
                  type: 'error',
                  text1: err?.data?.error,
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
              <Image
                source={require('../../assets/potesw.png')}
                style={styles.potesTextImage}
              />
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
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.title}>Email</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        placeholderTextColor="#888"
                        value={values.username}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                      />
                    </View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitButtonText}>Send OTP</Text>
                    </TouchableOpacity>

                    <View style={styles.registerView}>
                      <Text style={styles.normalText}>
                        Don't Have an account?{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                      >
                        <Text style={styles.registerText}>Register</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#36413e',
  },
  container: {
    flex: 1,
    backgroundColor: '#bfb0a0',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  potesTextImage: {
    alignSelf: 'center',
    marginBottom: 30,
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
  forgotText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  registerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  normalText: {
    fontWeight: '400',
    fontSize: 15,
    color: '#000',
  },
  registerText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
  },
});
