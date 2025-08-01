// app.config.js
const appJson = require("./app.json");

module.exports = ({ config }) => {
  // `config` here contains the parsed app.json under `config.expo`
  const base = config.expo || appJson.expo;

  return {
    expo: {
      // 1️⃣ start by spreading in *all* your app.json.expo values
      ...base,

      // ① Native “canvas” color behind your JS bundle on cold start
      backgroundColor: "#ffffffff",

      // ② Splash screen settings
      splash: {
        // preserve any existing splash.image & resizeMode
        ...(base.splash || {}),
        backgroundColor: "#ffffffff",
      },

      // (optional) if you want to ensure your android status bar matches:
      //   androidStatusBar: {
      //     backgroundColor: "#ffffffff",
      //     style: "dark-content",
      //   },
    },
  };
};
