import {ToastType} from 'react-native-toast-notifications';

export const beforeUploadFile = (
  file: any,
  type: 'photo' | 'video' | 'all',
  toast: ToastType,
) => {
  const isImage = /image\/(jpeg|png|heic|jpg|webm)/.test(file.type);
  const isVideo = /video\/(mp4|avi|mkv|quicktime|webm)/.test(file.type);

  let isValidFile = file;
  if (type === 'photo') {
    isValidFile = isImage;
  } else if (type === 'video') {
    isValidFile = isVideo;
  } else {
    isValidFile = isImage || isVideo;
  }

  if (!isValidFile) {
    toast.show('Invalid file type', {type: 'danger', placement: 'top'});
    return false;
  }

  const isLt100M = file.size && file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    toast.show('File size exceeds 100MB', {type: 'danger', placement: 'top'});
    return false;
  }

  return true;
};
