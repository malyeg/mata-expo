export const Config = {
  SCHEMA_PREFIX: "app_",
  SCHEMA_VERSION: 1,
  SCHEMA_NAME: "app",
  SCHEMA: {
    activities: "activities",
    users: "users",
  },
  algolia: {
    ALGOLIA_APP_KEY: process.env.ALGOLIA_APP_KEY ?? "5ELNRF7XR0",
    ALGOLIA_SEARCH_KEY:
      process.env.ALGOLIA_SEARCH_KEY ?? "9d991dc7beaa99dcfb413eb3d8aef756",
  },
};
