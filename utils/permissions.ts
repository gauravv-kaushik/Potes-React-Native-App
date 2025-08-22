import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestMediaPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ]);

        return (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_MEDIA_IMAGES'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 6 - 12
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        return (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  return true; // iOS auto handles via Info.plist
};
