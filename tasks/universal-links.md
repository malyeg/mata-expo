# Feature: Universal Links (Deep Linking)

**Status:** App-side Implementation Complete (Pending: server deployment, native rebuild, testing)

---

## Business Logic & Goal

Replace Firebase Dynamic Links (deprecated August 2025) with native Universal Links (iOS) and App Links (Android). When users share links like `https://www.mataup.com/items/123`, recipients with the app installed will have it open directly in the app.

- Shared links should be web URLs (not app scheme URLs)
- Links should open directly in the app if installed
- Support deep linking to Items, Deals, and User profiles
- Maintain backward compatibility with existing app scheme (`mataapp://`)
- Support legacy Firebase domain (`mataapp.page.link`) for existing shared links

---

## Technical Implementation Plan

### 1. Dependencies

| Package        | Status    | Notes                                   |
| -------------- | --------- | --------------------------------------- |
| `expo-linking` | Installed | Already in use                          |
| `expo-router`  | Installed | Handles deep link routing automatically |

> No new dependencies required. Expo Router handles universal links natively.

### 2. Supported Domains

| Domain              | Purpose                | Notes                                                 |
| ------------------- | ---------------------- | ----------------------------------------------------- |
| `www.mataup.com`    | Primary domain         | New links will use this domain (canonical)            |
| `mataup.com`        | Redirect domain        | Redirects to www, included for edge cases             |
| `mataapp.page.link` | Legacy Firebase domain | For backward compatibility with existing shared links |

### 3. Platform Configuration

#### iOS - Associated Domains

Apple requires your app to declare which domains it can handle via Universal Links.

| Configuration      | Location                                  | Value                                                                              |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Associated Domains | `app.config.ts` → `ios.associatedDomains` | `["applinks:www.mataup.com", "applinks:mataup.com", "applinks:mataapp.page.link"]` |

#### Android - Intent Filters

Android requires intent filters to declare which URL patterns your app handles.

| Configuration  | Location                                  | Value                                  |
| -------------- | ----------------------------------------- | -------------------------------------- |
| Intent Filters | `app.config.ts` → `android.intentFilters` | Array of URL patterns for both domains |

### 4. URL Structure

| Content Type | Primary URL                                   | Legacy URL                                       | App Route               |
| ------------ | --------------------------------------------- | ------------------------------------------------ | ----------------------- |
| Home         | `https://www.mataup.com/home`                 | `https://mataapp.page.link/home`                 | `/home`                 |
| Item Details | `https://www.mataup.com/items/{id}`           | `https://mataapp.page.link/items/{id}`           | `/items/[id]`           |
| Deal Details | `https://www.mataup.com/deals/{id}`           | `https://mataapp.page.link/deals/{id}`           | `/deals/[id]`           |
| User Profile | `https://www.mataup.com/users/{id}`           | `https://mataapp.page.link/users/{id}`           | `/users/[id]`           |
| Contact      | `https://www.mataup.com/contact`              | `https://mataapp.page.link/contact`              | `/contact`              |
| Account      | `https://www.mataup.com/account`              | `https://mataapp.page.link/account`              | `/account`              |
| Edit Profile | `https://www.mataup.com/account/edit-profile` | `https://mataapp.page.link/account/edit-profile` | `/account/edit-profile` |
| Add Item     | `https://www.mataup.com/add-item`             | `https://mataapp.page.link/add-item`             | `/add-item`             |

### 5. Domain Verification Files (Server-Side)

> **Note:** These files must be hosted on your web server. This is NOT app code, but included for reference.

#### iOS: `/.well-known/apple-app-site-association`

This file must be hosted on **all** domains:

- `https://www.mataup.com/.well-known/apple-app-site-association`
- `https://mataup.com/.well-known/apple-app-site-association` (if not redirecting)
- `https://mataapp.page.link/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["VX43W4S7M9.com.mata.mataapp"],
        "components": [
          { "/": "/items/*", "comment": "Item details" },
          { "/": "/deals/*", "comment": "Deal details" },
          { "/": "/users/*", "comment": "User profiles" }
        ]
      }
    ]
  }
}
```

> Team ID `VX43W4S7M9` has been filled in above.

#### Android: `/.well-known/assetlinks.json`

This file must be hosted on **all** domains:

- `https://www.mataup.com/.well-known/assetlinks.json`
- `https://mataup.com/.well-known/assetlinks.json` (if not redirecting)
- `https://mataapp.page.link/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.mata.mataapp",
      "sha256_cert_fingerprints": [
        "2E:F8:FA:D5:65:73:C5:01:00:E5:B4:14:2D:69:6B:70:E1:94:EE:EA:9B:E6:7D:60:FE:39:31:DB:A3:96:BF:E8"
      ]
    }
  }
]
```

> SHA-256 fingerprint has been filled in above (from Google Play Console → App signing).

> **Note for Firebase domain:** You may not have control over the `mataapp.page.link` domain's `.well-known` files. Firebase may still serve these automatically until the service is fully deprecated. If not, the legacy domain will only work on devices that already have the app installed.

---

## Execution Plan

### Phase 1: Update App Configuration

1. [x] **Update `app.config.ts` - Add iOS Associated Domains:**

   ```typescript
   ios: {
     // ... existing config
     associatedDomains: [
       "applinks:www.mataup.com",
       "applinks:mataup.com",
       "applinks:mataapp.page.link",
     ],
   }
   ```

2. [x] **Update `app.config.ts` - Add Android Intent Filters:**

   ```typescript
   android: {
     // ... existing config
     intentFilters: [
       {
         action: "VIEW",
         autoVerify: true,
         data: [
           // Primary domain (www)
           { scheme: "https", host: "www.mataup.com", pathPrefix: "/items" },
           { scheme: "https", host: "www.mataup.com", pathPrefix: "/deals" },
           { scheme: "https", host: "www.mataup.com", pathPrefix: "/users" },
           // Non-www domain (redirects to www, but included for safety)
           { scheme: "https", host: "mataup.com", pathPrefix: "/items" },
           { scheme: "https", host: "mataup.com", pathPrefix: "/deals" },
           { scheme: "https", host: "mataup.com", pathPrefix: "/users" },
           // Legacy Firebase domain
           { scheme: "https", host: "mataapp.page.link", pathPrefix: "/items" },
           { scheme: "https", host: "mataapp.page.link", pathPrefix: "/deals" },
           { scheme: "https", host: "mataapp.page.link", pathPrefix: "/users" },
         ],
         category: ["BROWSABLE", "DEFAULT"],
       },
     ],
   }
   ```

### Phase 2: Update Constants

3. [x] **Update `src/config/constants.ts`:**

   ```typescript
   // Primary domain for new links (use www since mataup.com redirects to www.mataup.com)
   const BASE_URL = "https://www.mataup.com";
   const SHARE_DOMAIN = BASE_URL;

   // Legacy domain (kept for reference)
   const LEGACY_FIREBASE_URL = "https://mataapp.page.link";
   ```

### Phase 3: Update Share Functionality

4. [x] **Update `src/hooks/useShare.ts`:**

   Change `shareLink` to generate web URLs instead of app scheme URLs:

   ```typescript
   import constants from "@/config/constants";

   const shareLink = useCallback(
     async (
       path: string,
       queryParams: Record<string, string> = {},
       text: string = ""
     ): Promise<ShareResult> => {
       try {
         // Generate a web URL for universal links
         const baseUrl = constants.BASE_URL;
         const queryString = new URLSearchParams(queryParams).toString();
         const url = queryString
           ? `${baseUrl}${path}?${queryString}`
           : `${baseUrl}${path}`;

         const message = text ? `${text} ${url}` : url;
         await Share.open({ message });
         return { success: true };
       } catch (error) {
         return {
           success: false,
           error: error instanceof Error ? error : new Error(String(error)),
         };
       }
     },
     []
   );
   ```

### Phase 4: Verify Deep Link Handling

5. [x] **Verify Expo Router handles incoming links:**

   Expo Router automatically handles deep links based on file structure. Verify these routes exist:

   | Route File                              | Handles URL   |
   | --------------------------------------- | ------------- |
   | `src/app/(main)/(stack)/items/[id].tsx` | `/items/{id}` |
   | `src/app/(main)/(stack)/deals/[id].tsx` | `/deals/{id}` |
   | `src/app/(main)/(stack)/users/[id].tsx` | `/users/{id}` |

### Phase 5: Rebuild Native Apps

6. [ ] **Rebuild iOS and Android apps:**

   ```bash
   # Clean and rebuild
   npx expo prebuild --clean

   # Or use EAS Build
   eas build --platform ios
   eas build --platform android
   ```

   > **Important:** Universal Links configuration requires a native rebuild. Metro bundler changes alone won't work.

### Phase 6: Host Verification Files (Server-Side)

7. [ ] **Deploy `apple-app-site-association` to `www.mataup.com` web server**
8. [ ] **Deploy `assetlinks.json` to `www.mataup.com` web server**
9. [ ] **Verify Firebase domain still serves verification files (or deploy if you have access)**

---

## Key Files to Modify

| File                      | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `app.config.ts`           | Add `associatedDomains` (iOS) and `intentFilters` (Android) for both domains |
| `src/config/constants.ts` | Update `BASE_URL` and `SHARE_DOMAIN`                                         |
| `src/hooks/useShare.ts`   | Generate web URLs instead of app scheme URLs                                 |

---

## Edge Cases & Considerations

### Authentication Required Links

- If a shared link requires authentication (e.g., deal details), the app should:

  1. Store the intended destination
  2. Redirect to login if not authenticated
  3. Navigate to the destination after successful login

- Expo Router's `Stack.Protected` guards already handle this in `_layout.tsx`

### Backward Compatibility

- Keep the existing `scheme: "mataapp"` in `app.config.ts`
- The app will handle all link types:
  - New universal links: `https://www.mataup.com/items/123`
  - Non-www links: `https://mataup.com/items/123` (redirects to www)
  - Legacy Firebase links: `https://mataapp.page.link/items/123`
  - Old app scheme links: `mataapp://items/123`

### Link Preview (Social Sharing)

- Universal links show web page previews when shared on social media
- For rich previews, your web server should return proper Open Graph meta tags
- This is handled server-side, not in the app

### Development vs Production

| Environment | iOS Universal Links      | Android App Links        |
| ----------- | ------------------------ | ------------------------ |
| Development | May not work in Expo Go  | May not work in Expo Go  |
| Dev Build   | Works with proper config | Works with proper config |
| Production  | Full support             | Full support             |

> **Note:** Test universal links using development builds (`npx expo run:ios` or `npx expo run:android`), not Expo Go.

### Firebase Domain Considerations

- Firebase Dynamic Links will be fully deprecated on August 25, 2025
- Until then, existing `mataapp.page.link` links may continue to work
- After deprecation, only the app-side handling will work (if the app is installed)
- New links should always use the primary `www.mataup.com` domain

---

## Testing Checklist

### Prerequisites

Before testing, ensure:

1. [ ] Server files deployed to `www.mataup.com/.well-known/`
2. [ ] Native app rebuilt with `npx expo prebuild --clean`
3. [ ] App installed on test device (not Expo Go)

### iOS Testing

- [ ] App opens from `https://www.mataup.com/items/{id}` link (Safari)
- [ ] App opens from `https://www.mataup.com/home` link (Safari)
- [ ] App opens from `https://www.mataup.com/contact` link (Safari)
- [ ] App opens from `https://www.mataup.com/account` link (Safari)
- [ ] App opens from `https://www.mataup.com/add-item` link (Safari)
- [ ] App opens from `https://mataapp.page.link/items/{id}` link (Safari)
- [ ] App opens from link in Messages app
- [ ] App opens from link in Notes app
- [ ] Correct screen displays after deep link navigation
- [ ] Auth-protected routes redirect to login then navigate correctly

### Android Testing

- [ ] App opens from `https://www.mataup.com/items/{id}` link (Chrome)
- [ ] App opens from `https://www.mataup.com/home` link (Chrome)
- [ ] App opens from `https://www.mataup.com/contact` link (Chrome)
- [ ] App opens from `https://www.mataup.com/account` link (Chrome)
- [ ] App opens from `https://www.mataup.com/add-item` link (Chrome)
- [ ] App opens from `https://mataapp.page.link/items/{id}` link (Chrome)
- [ ] App opens from link in messaging apps
- [ ] App opens from link in email apps
- [ ] Correct screen displays after deep link navigation
- [ ] Auth-protected routes redirect to login then navigate correctly

### Share Functionality Testing

- [ ] Sharing an item generates correct URL format (`https://www.mataup.com/items/{id}`)
- [ ] Sharing a deal generates correct URL format
- [ ] Sharing a user profile generates correct URL format
- [ ] Shared links are clickable in recipient's messaging app

---

## Step-by-Step Testing Instructions

### Step 1: Verify Server Files

Check that verification files are accessible:

```bash
# iOS verification file
curl -I https://www.mataup.com/.well-known/apple-app-site-association

# Android verification file
curl -I https://www.mataup.com/.well-known/assetlinks.json
```

Both should return `200 OK` with `Content-Type: application/json`.

### Step 2: Validate Configuration

**iOS Validation:**

- Visit: https://search.developer.apple.com/appsearch-validation-tool/
- Enter: `www.mataup.com`
- Verify your app ID appears in the results

**Android Validation:**

- Visit: https://developers.google.com/digital-asset-links/tools/generator
- Enter hostname: `www.mataup.com`
- Enter package name: `com.mata.mataapp`
- Click "Test statement"

### Step 3: Build and Install App

```bash
# Clean prebuild
npx expo prebuild --clean

# Run on iOS simulator/device
npx expo run:ios

# Run on Android emulator/device
npx expo run:android
```

### Step 4: Test Links via ADB (Android)

```bash
# Test all routes
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/home" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/items/test123" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/deals/test123" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/users/test123" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/contact" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/account" com.mata.mataapp
adb shell am start -W -a android.intent.action.VIEW -d "https://www.mataup.com/add-item" com.mata.mataapp

# Test legacy domain
adb shell am start -W -a android.intent.action.VIEW -d "https://mataapp.page.link/items/test123" com.mata.mataapp
```

### Step 5: Test Links via Xcode (iOS)

```bash
# Open Xcode scheme settings
# Product → Scheme → Edit Scheme → Run → Arguments → Environment Variables
# Add: -com.apple.CoreSimulator.SimulatorAppEnvironment = applinks:www.mataup.com

# Or test via xcrun
xcrun simctl openurl booted "https://www.mataup.com/items/test123"
xcrun simctl openurl booted "https://www.mataup.com/home"
xcrun simctl openurl booted "https://www.mataup.com/contact"
xcrun simctl openurl booted "https://www.mataup.com/account"
xcrun simctl openurl booted "https://www.mataup.com/add-item"
```

### Step 6: Test Share Functionality

1. Open an item in the app
2. Tap the share button
3. Verify the shared URL is `https://www.mataup.com/items/{id}` (not `mataapp://`)
4. Share to another device/simulator
5. Verify the link opens the app on the recipient device

### Debug Commands

```bash
# Android - Check app link verification status
adb shell pm get-app-links com.mata.mataapp

# Android - Check link handling preferences
adb shell dumpsys package d | grep -A 10 "mataup.com"

# Android - Reset link handling (if needed)
adb shell pm set-app-links --package com.mata.mataapp 0 all

# iOS - Check associated domains entitlement
# In Xcode: Select app target → Signing & Capabilities → Associated Domains
```

---

## Troubleshooting

### iOS: Links Open in Safari Instead of App

1. Verify `apple-app-site-association` is accessible at `https://www.mataup.com/.well-known/apple-app-site-association`
2. Check the file is served with `Content-Type: application/json`
3. Verify Team ID in the file matches your provisioning profile
4. Clear Safari cache and reinstall the app
5. Use Apple's validator: `https://search.developer.apple.com/appsearch-validation-tool/`

### Android: Links Open in Browser Instead of App

1. Verify `assetlinks.json` is accessible at `https://www.mataup.com/.well-known/assetlinks.json`
2. Check SHA256 fingerprint matches your signing key
3. Ensure `autoVerify: true` is set in intent filters
4. Clear Chrome defaults: Settings → Apps → Chrome → Open by default → Clear defaults
5. Use Google's validator: `https://developers.google.com/digital-asset-links/tools/generator`

### Links Don't Work in Development

- Universal/App Links require native builds
- Use `npx expo run:ios` or `npx expo run:android` instead of Expo Go
- Ensure you've run `npx expo prebuild` after config changes

### Legacy Firebase Links Not Working

- Firebase may stop serving verification files before full deprecation
- If the app is installed, links should still open via intent filters
- For users without the app, legacy links may show error pages after Firebase shutdown

---

## Migration Notes

### From Firebase Dynamic Links

| Firebase Dynamic Links  | Universal Links            |
| ----------------------- | -------------------------- |
| `mataapp.page.link/xyz` | `www.mataup.com/items/123` |
| Short link generation   | Not needed (use full URLs) |
| Analytics dashboard     | Use your own analytics     |
| Deferred deep linking   | Not available natively     |

### Breaking Changes

- Old Firebase Dynamic Links will stop working after August 25, 2025
- Update any marketing materials with new link format
- Notify users if they have saved/bookmarked old links
- Legacy `mataapp.page.link` links will be supported in-app but may not have web fallback

---

## References

- [Expo Router: Universal Links](https://docs.expo.dev/router/reference/url-schemes/)
- [Apple: Supporting Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [Android: App Links](https://developer.android.com/training/app-links)
- [Firebase Dynamic Links Deprecation](https://firebase.google.com/support/dynamic-links-faq)
