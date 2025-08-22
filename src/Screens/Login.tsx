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
import Octicons from 'react-native-vector-icons/Octicons';
import { loginUser } from '../../apiStore/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';
import { StatusBar } from 'react-native';

const Login = ({ navigation }: any) => {
  const [showPassword, setShowPassword]: any = useState(false);
  const [loading, setLoading]: any = useState(false);
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('username is required'),
    password: Yup.string()
      .required('password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            setLoading(true);
            loginUser({
              body: {
                username: values?.username,
                password: values?.password,
              },
            })
              .then((res: any) => {
                AsyncStorage.setItem('accessToken', res?.token?.access);
                navigation.navigate('Main');
                Toast.show({
                  type: 'success',
                  text1: `${res?.msg}`,
                  text2: `Welcome back! ${values?.username}`,
                });
              })
              .catch((err: any) => {
                Toast.show({
                  type: 'error',
                  text1: `Invalid Credentials`,
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
                    <Text style={styles.title}>Username</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter username"
                        placeholderTextColor="#888"
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                      />
                    </View>
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    <Text style={styles.title}>Password</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter password"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword}
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
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgotPassword')}
                    >
                      <Text style={styles.forgotText}>Forgot Password ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitButtonText}>Login</Text>
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

export default Login;

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
    color: '#000',
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
