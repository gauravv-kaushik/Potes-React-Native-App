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
  StatusBar,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Octicons from 'react-native-vector-icons/Octicons';
import { forgotPasswordResetPassword } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';

const ForgotNewPassword = ({ navigation, route }: any) => {
  const { email, otp } = route?.params;
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading]: any = useState(false);
  const validationSchema = Yup.object().shape({
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
            password: '',
            password2: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            setLoading(true);
            forgotPasswordResetPassword({
              body: {
                email: email,
                otp: otp,
                new_password: values?.password,
                confirm_password: values?.password2,
              },
            })
              .then((res: any) => {
                Toast.show({
                  type: 'success',
                  text1: res.msg,
                });
                navigation.navigate('Login');
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
                    <Text style={styles.title}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Confirm password"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword2}
                        value={values.password2}
                        onChangeText={handleChange('password2')}
                        onBlur={handleBlur('password2')}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword2(!showPassword2)}
                      >
                        <Octicons
                          name={showPassword2 ? 'eye' : 'eye-closed'}
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
                      <Text style={styles.submitButtonText}>
                        Change Password
                      </Text>
                    </TouchableOpacity>
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

export default ForgotNewPassword;

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
  },
  registerText: {
    fontWeight: '600',
    fontSize: 15,
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
});
