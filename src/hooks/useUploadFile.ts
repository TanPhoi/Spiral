import {beforeUploadFile} from '@/utils/fileUpload';
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useToast} from 'react-native-toast-notifications';

export const useUploadFile = (type: 'photo' | 'video' | 'all') => {
  const toast = useToast();
  const [error, setError] = useState<string>('');
  const [files, setFiles] = useState<Asset[]>([]);

  const handleUpdateFile = async (): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }

      const res = await launchImageLibrary({
        mediaType: type === 'all' ? 'mixed' : type,
        selectionLimit: type === 'all' ? 15 : 1,
      });

      if (!res.assets) {
        setError('No file selected');
        return;
      }

      const validFiles = res.assets.filter(asset => {
        const payload = {
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
          size: asset.fileSize,
        };
        return beforeUploadFile(payload, type, toast);
      });

      if (validFiles.length > 0) {
        setFiles(validFiles);
      } else {
        toast.show(`Invalid ${type !== 'all' ? type : 'file'} format`, {
          type: 'danger',
          placement: 'top',
        });
        setFiles([]);
        setError(`Invalid ${type} format`);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to update files');
    }
  };

  const resetFile = (): void => {
    setFiles([]);
  };

  return {files, error, handleUpdateFile, resetFile};
};
