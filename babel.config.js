module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Adjust the root path if necessary
        alias: {
          '@': './src', // This sets up the alias
        },
      },
    ],
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv']
  ],
};
