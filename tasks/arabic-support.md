# 🎯 Feature: Arabic Language Support (RTL)

**Status:** 🟡 In Progress

---

## 🧠 Business Logic & Goal

Add full Arabic support to the app. Users should be able to toggle between English (LTR) and Arabic (RTL) in the drawer menu or settings.

- Default behavior: Detect device language on first load.
- If Arabic, the **entire layout** must flip (Right-to-Left).
- Use the **Cairo** font for Arabic text (it looks much better than system defaults).

---

## 🛠 Technical Implementation Plan

### 1. Dependencies

| Package                    | Status           | Notes                            |
| -------------------------- | ---------------- | -------------------------------- |
| `i18next`                  | ✅ Installed     | Already in `package.json`        |
| `react-i18next`            | ✅ Installed     | Already in `package.json`        |
| `expo-localization`        | ❌ Not Installed | For device language detection    |
| `@expo-google-fonts/cairo` | ❌ Not Installed | Arabic font                      |
| `expo-updates`             | ❌ Not Installed | To reload app when switching RTL |

### 2. Locale Files

| File                   | Status      | Notes                             |
| ---------------------- | ----------- | --------------------------------- |
| `src/locales/en/en.ts` | ✅ Complete | ~700 lines of translations        |
| `src/locales/ar/ar.ts` | ✅ Complete | ~680 lines of Arabic translations |
| `src/locales/i18n.ts`  | 🟡 Partial  | Arabic import is commented out    |

### 3. RTL & Styling Rules

- Use `I18nManager.isRTL` for conditional styling when needed
- Use `flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'` for manual RTL control
- Icons that indicate direction (arrows, chevrons) should flip in RTL mode
- **Note:** Most React Native components handle RTL automatically once `I18nManager.forceRTL(true)` is set

### 4. Language Switch Logic

When user selects Arabic:

1. Save preference to `AsyncStorage` with key: `language`
2. `i18n.changeLanguage('ar')`
3. `I18nManager.allowRTL(true)`
4. `I18nManager.forceRTL(true)`
5. Reload app (see restart options below)

When user selects English:

1. Save preference to `AsyncStorage` with key: `language`
2. `i18n.changeLanguage('en')`
3. `I18nManager.forceRTL(false)`
4. Reload app

### 5. App Restart Options

| Environment | Method                                            | Notes                           |
| ----------- | ------------------------------------------------- | ------------------------------- |
| Production  | `Updates.reloadAsync()` from `expo-updates`       | Works in standalone/production  |
| Development | `DevSettings.reload()` from `react-native`        | Works in dev client             |
| Both        | `RNRestart.Restart()` from `react-native-restart` | Alternative if above don't work |

> ⚠️ **Important:** `expo-updates` only works in production builds. For development, use a conditional approach.

---

## ✅ Execution Plan

### Phase 1: Setup Dependencies

1. [ ] **Install missing packages:**
   ```bash
   yarn add expo-localization @expo-google-fonts/cairo expo-updates
   ```

### Phase 2: Enable Arabic in i18n Config

2. [ ] **Update `src/locales/i18n.ts`:**
   - Uncomment Arabic import: `import ar from './ar/ar';`
   - Add `ar: ar` to resources object
   - Use `expo-localization` to detect device language on first launch
   - Check `AsyncStorage` for saved language preference (returning users)

### Phase 3: Load Cairo Font

3. [ ] **Update `src/app/_layout.tsx`:**

   - Import Cairo font: `useFonts({ Cairo_400Regular, Cairo_700Bold })`
   - Keep splash screen visible until fonts load
   - Pass font loaded status to app

4. [ ] **Update `src/styles/theme.ts`:**
   - Add `fontFamily` config that switches based on locale
   - Create helper: `getFontFamily(locale: string) => locale === 'ar' ? 'Cairo_400Regular' : undefined`

### Phase 4: Create Language Switcher

5. [ ] **Create `src/hooks/useLanguage.ts`:**

   - Encapsulate language switching logic
   - Handle AsyncStorage read/write
   - Handle I18nManager RTL settings
   - Handle app restart

6. [ ] **Create `src/components/widgets/LanguageSwitcher.tsx`:**

   - Simple toggle or selector UI
   - Show current language
   - Warn user that app will restart

7. [ ] **Add Language Switcher to Drawer:**
   - Update `src/navigation/DrawerContent.tsx`
   - Uncomment language toggle (lines 96-99) and wire up

### Phase 5: Handle Initial Language Detection

8. [ ] **Update `src/app/_layout.tsx` initialization:**
   - On first launch: detect device language via `expo-localization`
   - On subsequent launches: read from `AsyncStorage`
   - Set `I18nManager.forceRTL()` before first render

---

## 📁 Key Files to Modify

| File                                          | Purpose                                                |
| --------------------------------------------- | ------------------------------------------------------ |
| `src/locales/i18n.ts`                         | Enable Arabic resources & language detection           |
| `src/app/_layout.tsx`                         | Load Cairo font & initialize RTL on app start          |
| `src/hooks/useLanguage.ts`                    | New hook for language switching logic                  |
| `src/components/widgets/LanguageSwitcher.tsx` | New UI component for language toggle                   |
| `src/navigation/DrawerContent.tsx`            | Add language switcher to drawer menu                   |
| `src/styles/theme.ts`                         | Font family configuration for Arabic                   |
| `src/config/constants.ts`                     | Locale config (already has `STORAGE_NAME: "language"`) |

---

## ⚠️ Edge Cases & Considerations

### Third-Party Libraries

| Library                      | RTL Support | Notes                                                 |
| ---------------------------- | ----------- | ----------------------------------------------------- |
| `react-native-maps`          | 🟡 Partial  | Map itself is fine, but controls may need manual flip |
| `react-native-gifted-chat`   | ✅ Yes      | Has built-in `isRTL` prop                             |
| `react-native-modal`         | ✅ Yes      | Works automatically                                   |
| `react-native-toast-message` | 🟡 Partial  | May need custom positioning                           |

### Text Alignment

- Most text will auto-align with RTL
- For specific `textAlign` overrides, use `I18nManager.isRTL ? 'right' : 'left'`

### Icons & Images

- Directional icons (back arrows, chevrons) should flip
- Use `transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]` for manual flip
- Non-directional icons (home, settings) should NOT flip

### Hardcoded Strings

- Search for any remaining hardcoded strings in components
- Ensure all user-facing text uses `t('key')` pattern

---

## 🧪 Testing Checklist

- [ ] App detects device language on first install
- [ ] Language preference persists after app restart
- [ ] All screens flip correctly in RTL mode
- [ ] Cairo font loads and displays correctly for Arabic
- [ ] Navigation (back buttons, drawer) work correctly in RTL
- [ ] Forms and inputs work correctly in RTL
- [ ] Maps display correctly in RTL
- [ ] Chat interface works in RTL
- [ ] Notifications display correctly in RTL
- [ ] All text uses translations (no hardcoded strings)

---

## 🔍 Notes

- The app already uses `useLocale` hook throughout (see `src/hooks/useLocale.tsx`)
- Translation keys are already used in components via `t('key')` pattern
- Arabic translations are comprehensive and ready to use
- The drawer already has a commented-out language toggle (lines 96-99 in `DrawerContent.tsx`)
- `LocalizationContext.tsx` has commented-out `updateLocale` function that can be used as reference
