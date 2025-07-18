declare global {
  var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean | undefined;
}

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

export const getWarningsOff = () => {
  return globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS;
};
