import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { changeUserPassword } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';

const ChangePassword = ({ navigation }: any) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]: any = useState(false);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required')
      .min(8, 'Password must be at least 8 characters'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => navigation.goBack()}
      >
        <Octicons name="arrow-left" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.heading}>Change your password</Text>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          setLoading(true);
          changeUserPassword({
            body: {
              curr_password: values?.currentPassword,
              new_password1: values?.newPassword,
              new_password2: values?.confirmPassword,
            },
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
                text1: 'Wrong Password Entered',
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
            {loading && <Loader />}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter current password"
                placeholderTextColor="#888"
                secureTextEntry={!showCurrent}
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                onBlur={handleBlur('currentPassword')}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Octicons
                  name={showCurrent ? 'eye' : 'eye-closed'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            {touched.currentPassword && errors.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new password"
                placeholderTextColor="#888"
                secureTextEntry={!showNew}
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Octicons
                  name={showNew ? 'eye' : 'eye-closed'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            {touched.newPassword && errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm new password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Octicons
                  name={showConfirm ? 'eye' : 'eye-closed'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Change Password</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '20%',
    backgroundColor: '#bfb0a0',
    paddingHorizontal: 30,
  },
  arrow: {
    marginBottom: '10%',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 10,
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
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#36413e',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
