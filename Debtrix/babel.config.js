module.exports = function configureBabel(api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          worklets: false,
          reanimated: false,
        },
      ],
    ],
  };
};
