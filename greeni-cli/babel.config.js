module.exports = function (api) {
  const isProduction = api.env("production");

  return {
    presets: ["module:@react-native/babel-preset"],
    plugins: [isProduction && "transform-remove-console", "react-native-worklets/plugin"].filter(
      Boolean,
    ),
  };
};
