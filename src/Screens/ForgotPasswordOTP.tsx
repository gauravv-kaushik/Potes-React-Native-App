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
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  forgotPasswordVerifyEmailOTP,
  registerVerifyOTP,
} from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import { StatusBar } from 'react-native';

const ForgotPasswordOTP = ({ navigation, route }: any) => {
  const { username, email, from } = route?.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [loading, setLoading]: any = useState(false);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required('OTP is required')
      .length(4, 'OTP must be 4 digits'),
  });

  const handleOtpChange = (
    text: string,
    index: number,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    setFieldValue('otp', newOtp.join(''));

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#36413e" barStyle="light-content" />
      <View style={styles.container}>
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (from === 'register') {
              setLoading(true);
              registerVerifyOTP({
                body: {
                  username: username,
                  otp: values.otp,
                },
              })
                .then((res: any) => {
                  AsyncStorage.setItem('accessToken', res?.token?.access);
                  navigation.navigate('Main');
                  Toast.show({
                    type: 'success',
                    text1: `${res?.msg}`,
                    text2: `Welcome ${username}`,
                  });
                })
                .catch((err: any) => {
                  Toast.show({
                    type: 'error',
                    text1: err?.data?.error || 'Something went wrong',
                  });
                })
                .finally(() => setLoading(false));
            } else {
              setLoading(true);
              forgotPasswordVerifyEmailOTP({
                body: {
                  email: email,
                  otp: values.otp,
                },
              })
                .then((res: any) => {
                  Toast.show({
                    type: 'success',
                    text1: res?.msg,
                  });
                  navigation.navigate('ForgotNewPassword', {
                    email: email,
                    otp: values.otp,
                  });
                })
                .catch((err: any) => {
                  Toast.show({
                    type: 'error',
                    text1: err?.data?.error || 'Something went wrong',
                  });
                })
                .finally(() => setLoading(false));
            }
          }}
        >
          {({ handleSubmit, setFieldValue, errors, touched }: any) => (
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
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 20,
                        alignSelf: 'center',
                        marginBottom: 20,
                        color: '#000',
                      }}
                    >
                      Enter the OTP
                    </Text>
                    <Text style={{ color: '#444', alignSelf: 'center' }}>
                      Enter the OTP you recieved on {email}
                    </Text>
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={ref => {
                            inputs.current[index] = ref;
                          }}
                          style={styles.otpInput}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={digit}
                          onChangeText={text =>
                            handleOtpChange(text, index, setFieldValue)
                          }
                          onKeyPress={e => handleOtpKeyPress(e, index)}
                        />
                      ))}
                    </View>

                    {touched.otp && errors.otp && (
                      <Text style={styles.errorText}>{errors.otp}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitButtonText}>Verify OTP</Text>
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

export default ForgotPasswordOTP;

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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
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
    color: '#000',
  },
});
