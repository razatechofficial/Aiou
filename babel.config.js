// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     ['react-native-reanimated/plugin'],
//     ['react-native-worklets/plugin'],
//     [('@babel/plugin-proposal-decorators', { legacy: true })],
//   ],
// };

// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     ['react-native-reanimated/plugin', {}, 'reanimated-plugin'],
//     ['react-native-worklets/plugin', {}, 'worklets-plugin'],
//     ['@babel/plugin-proposal-decorators', { legacy: true }],
//   ],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-export-namespace-from'],
    ['react-native-reanimated/plugin', {}, 'reanimated-plugin'],
    ['react-native-worklets/plugin', {}, 'worklets-plugin'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
