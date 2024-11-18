const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  assets: ['./assets/fonts'],
  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

  return config;
})();
