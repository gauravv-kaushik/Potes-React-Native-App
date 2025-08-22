import {
  Image,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from 'react-native-vector-icons/Feather';
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  MediaType,
  CameraOptions,
  launchCamera,
} from 'react-native-image-picker';
import { editUserProfile, getUserProfile } from '../../apiStore/services';
import Toast from 'react-native-toast-message';
import { useUser } from '../../context/UserContext';
import Loader from '../../components/Loader';
import { requestMediaPermissions } from '../../utils/permissions';

const InputItem = ({
  title,
  value,
  placeholder,
  state,
  editable,
  gray,
}: any) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>
        {title}
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#888"
        onChangeText={state}
        editable={editable}
        style={{
          padding: 15,
          backgroundColor: gray ? '#666' : '#fff',
          color: gray ? '#fff' : '#000',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          marginTop: 5,
          marginBottom: 5,
          fontWeight: '600',
        }}
      />
    </View>
  );
};

const Profile = ({ navigation }: any) => {
  const { setGlobalProfilePic }: any = useUser();

  const pickImage2 = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      quality: 1,
    };
    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setLoading(true);
        const asset = response.assets[0];
        const formData = new FormData();

        formData.append('profile_pic', {
          uri:
            Platform.OS === 'android'
              ? asset.uri
              : asset.uri.replace('file://', ''),
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        });

        editUserProfile({
          body: formData,
        })
          .then((res: any) => {
            setProfilePic(res?.data?.profile_pic);
            setGlobalProfilePic(res?.data?.profile_pic);
            Toast.show({
              type: 'success',
              text1: 'Profile picture updated successfully',
            });
          })
          .catch((err: any) => {
            console.error('error', JSON.stringify(err));
            Toast.show({
              type: 'error',
              text1: 'Something went wrong',
            });
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Please allow Camera & Storage access',
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.2,
    };

    launchCamera(options, handleResponse);
  };

  const openGallery = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      Alert.alert('Permission required', 'Please allow Gallery access');
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.2,
      selectionLimit: 1,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleResponse = async (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      setLoading(true);
      const asset = response.assets[0];
      const formData = new FormData();

      formData.append('profile_pic', {
        uri:
          Platform.OS === 'android'
            ? asset.uri
            : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      });

      editUserProfile({ body: formData })
        .then((res: any) => {
          setProfilePic(res?.data?.profile_pic);
          setGlobalProfilePic(res?.data?.profile_pic);
          Toast.show({
            type: 'success',
            text1: 'Profile picture updated successfully',
          });
        })
        .catch((err: any) => {
          console.error('Upload error', err);
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const [profile_pic, setProfilePic]: any = useState(null);
  const [first_name, setFirst_name]: any = useState('');
  const [last_name, setLast_name]: any = useState('');
  const [email, setEmail]: any = useState('');
  const [username, setUsername]: any = useState('');
  const [editable, setEditable]: any = useState(false);
  const [loading, setLoading]: any = useState(false);

  const INPUTDATA = [
    {
      title: 'First Name',
      value: first_name,
      placeholder: 'Enter First Name',
      state: setFirst_name,
      editable: editable,
    },
    {
      title: 'Last Name',
      value: last_name,
      placeholder: '',
      state: setLast_name,
      editable: editable,
    },
    {
      title: 'Email',
      value: email,
      placeholder: 'Enter Email',
      state: setEmail,
      editable: false,
    },
    {
      title: 'Username',
      value: username,
      placeholder: 'Enter Username',
      state: setUsername,
      editable: false,
    },
  ];

  const getUserData = () => {
    setLoading(true);
    getUserProfile()
      .then((res: any) => {
        setProfilePic(res?.profile_pic);
        setGlobalProfilePic(res?.profile_pic);
        setUsername(res?.username);
        setFirst_name(res?.first_name);
        setLast_name(res?.last_name);
        setEmail(res?.email);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getUserData();
  }, []);

  const updateName = (new_first_name: any, new_last_name: any) => {
    if (new_first_name.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'please enter first name',
      });
      return;
    }
    editUserProfile({
      body: { first_name: new_first_name, last_name: new_last_name },
    }).then((res: any) => {
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
      setFirst_name(res?.data?.first_name);
      setLast_name(res?.data?.last_name);
      setEditable(false);
    });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#36413e' }}>
      <View style={styles.container}>
        <Header navigation={navigation} left="back" from="stack" />
        <View style={styles.innerdiv}>
          {loading && <Loader />}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.pressable}
                onPress={() => navigation.navigate('CreateContact')}
              >
                <Text style={styles.pressableText}>+ Create Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pressable}
                onPress={() => navigation.navigate('CreateNote')}
              >
                <Text style={styles.pressableText}>+ Create Note</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imgContainer}>
              <View style={styles.imgDiv}>
                <Image
                  source={
                    profile_pic
                      ? { uri: profile_pic }
                      : require('../../assets/userAvatar.png')
                  }
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.camera} onPress={pickImage}>
                  <Feather name="camera" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            {INPUTDATA.map((item, index) => (
              <InputItem
                key={index}
                title={item.title}
                value={item.value}
                placeholder={item.placeholder}
                state={item.state}
                editable={item.editable}
                gray={item?.title === 'Email' || item?.title === 'Username'}
              />
            ))}

            {!editable ? (
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => setEditable(true)}
              >
                <Text style={styles.buttonText}>Update Name</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editView}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditable(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => updateName(first_name, last_name)}
                >
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.buttons}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36413e',
    alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
  imgContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imgDiv: {
    position: 'relative',
  },
  avatar: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  camera: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  innerdiv: {
    backgroundColor: '#bfb0a0',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 20,
    marginBottom: 20,
  },
  pressable: {
    backgroundColor: '#36413e',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 15,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressableText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  buttons: {
    textAlign: 'center',
    backgroundColor: '#36413e',
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  editView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: '10%',
  },
  cancelButton: {
    backgroundColor: 'gray',
    width: '48%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#36413e',
    width: '48%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Profile;
