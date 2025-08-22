import {
  Image,
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
} from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Octicons from 'react-native-vector-icons/Octicons';
import { registerUser } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';
import { StatusBar } from 'react-native';

const Register = ({ navigation }: any) => {
  const [showPassword, setShowPassword]: any = useState(false);
  const [showConfirmPassword, setShowConfirmPassword]: any = useState(false);
  const [loading, setLoading]: any = useState(false);
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('username is required'),
    first_name: Yup.string()
      .required('first name is required')
      .min(2, 'First Name must be at least 2 characters'),
    last_name: Yup.string(),
    email: Yup.string()
      .email('Invalid email format')
      .required('email is required'),
    password: Yup.string()
      .required('password is required')
      .min(8, 'Password must be at least 8 characters'),
    password2: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            password2: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            setLoading(true);
            registerUser({
              body: {
                first_name: values?.first_name,
                last_name: values?.last_name,
                username: values?.username,
                email: values?.email,
                password: values?.password,
                password2: values?.password2,
              },
            })
              .then((res: any) => {
                Toast.show({
                  type: 'success',
                  text1: res?.msg,
                });
                navigation.navigate('ForgotPasswordOTP', {
                  email: values?.email,
                  username: values?.username,
                  from: 'register',
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
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.title}>
                      First name <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your first name"
                        placeholderTextColor="#888"
                        value={values.first_name}
                        onChangeText={handleChange('first_name')}
                        onBlur={handleBlur('first_name')}
                      />
                    </View>
                    {touched.first_name && errors.first_name && (
                      <Text style={styles.errorText}>{errors.first_name}</Text>
                    )}

                    <Text style={styles.title}>Last name</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your last name"
                        placeholderTextColor="#888"
                        value={values.last_name}
                        onChangeText={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                      />
                    </View>
                    {touched.last_name && errors.last_name && (
                      <Text style={styles.errorText}>{errors.last_name}</Text>
                    )}

                    <Text style={styles.title}>
                      username <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your username"
                        placeholderTextColor="#888"
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                      />
                    </View>
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    <Text style={styles.title}>
                      Email <Text style={styles.asterisk}>*</Text>
                    </Text>
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

                    <Text style={styles.title}>
                      Password <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter password"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#888"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Octicons
                          name={showPassword ? 'eye' : 'eye-closed'}
                          size={20}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <Text style={styles.title}>
                      Confirm Password <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter confirm password"
                        secureTextEntry={!showConfirmPassword}
                        value={values.password2}
                        placeholderTextColor="#888"
                        onChangeText={handleChange('password2')}
                        onBlur={handleBlur('password2')}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Octicons
                          name={showConfirmPassword ? 'eye' : 'eye-closed'}
                          size={20}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.password2 && errors.password2 && (
                      <Text style={styles.errorText}>{errors.password2}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitButtonText}>Register</Text>
                    </TouchableOpacity>

                    <View style={styles.loginView}>
                      <Text style={styles.normalText}>
                        Already Have an account?{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                      >
                        <Text style={styles.registerText}>Login</Text>
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

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#36413e',
  },
  container: {
    flex: 1,
    backgroundColor: '#bfb0a0',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  potesTextImage: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
  },
  asterisk: {
    color: 'red',
    fontSize: 14,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
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
  loginView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
