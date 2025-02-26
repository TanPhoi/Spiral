import {Dimensions, PixelRatio, Platform} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

export function wp(pixel: number) {
  return widthPercentageToDP((pixel / DESIGN_WIDTH) * 100);
}

export function hp(pixel: number) {
  return heightPercentageToDP((pixel / DESIGN_HEIGHT) * 100);
}

// based on iphone 5s's scale
const scale = width / 320;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
