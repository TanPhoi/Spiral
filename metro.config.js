const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'mp4'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
