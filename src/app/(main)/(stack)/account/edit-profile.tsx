import citiesApi, { City } from "@/api/citiesApi";
import countriesApi from "@/api/countriesApi";
import Tooltip from "@/components/Tooltip";
import { Button, Loader } from "@/components/core";
import FormScreen from "@/components/core/FormScreen";
import {
  CheckBox,
  Error,
  KeyboardView,
  Picker,
  TextInput,
} from "@/components/form";
import ProfileHeader from "@/components/widgets/ProfileHeader";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useForm from "@/hooks/useForm";
import useLocale from "@/hooks/useLocale";
import useToast from "@/hooks/useToast";
import { Profile } from "@/models/Profile.model";
import { Country } from "@/models/place.model";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";

export const EDIT_PROFILE_SCREEN_NAME = "EditProfileScreen";
type EditProfileFormValues = {
  email: string;
  firstName?: string;
  lastName?: string;
  country: string;
  phone: string;
  phoneCode: string;
  state: string;
  city: string;
  interests: string;
  acceptMarketingFlag: boolean;
};
const EditProfileScreen = () => {
  const { user, profile, loadProfile, updateProfile } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    profile?.country
  );

  const { t } = useLocale("editProfileScreen");
  const { showToast, hideToast } = useToast();

  const { loader, request } = useApi();

  const firstNameRef = useRef<any | null>(null);
  const secondNameRef = useRef<any | null>(null);

  const { control, formState, handleSubmit, setValue } =
    useForm<EditProfileFormValues>({
      firstName: yup.string().trim().max(200).required(t("firstName.required")),
      lastName: yup.string().trim().max(200).required(t("lastName.required")),
      country: yup.string().trim(),
      state: yup.string().trim(),
      city: yup.string().trim(),
      interests: yup.string().trim(),
      acceptMarketingFlag: yup.boolean(),
    });

  useEffect(() => {
    loadData().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!selectedCountry && profile?.country?.id !== selectedCountry.id) {
      setValue("state", "");
    }
  }, [selectedCountry, setValue, profile]);

  const loadData = async () => {
    try {
      if (!profile) {
        await request<Profile>(() => loadProfile());
      }
      if (profile?.state) {
        console.log("loading cities for state", profile.state.id);
        const newCities = await citiesApi.getByStateId(profile.state.id);
        if (newCities) {
          setCities(newCities);
          if (newCities.length === 1) {
            setValue("city", newCities[0].id);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const countries = useMemo(() => countriesApi.getCountries(), []);

  const states = useMemo(() => {
    setCities([]);
    return selectedCountry?.id
      ? countriesApi.getStates(selectedCountry.id)
      : [];
  }, [selectedCountry?.id]);

  const onCountryChange = useCallback((value: string) => {
    const selectedCounty = (countriesApi.getCountries() as Country[]).find(
      (country) => country.id.toString() === value.toString()
    );

    if (selectedCounty) {
      setSelectedCountry(selectedCounty);
    }
  }, []);
  const onStateChange = useCallback(
    async (value: string) => {
      const newCities = await citiesApi.getByStateId(value);
      if (newCities) {
        setCities(newCities);
        if (newCities.length === 1) {
          setValue("city", newCities[0].id);
        }
      }
      setValue("city", "");
    },
    [setValue]
  );

  const onFormSuccess = async (data: EditProfileFormValues) => {
    hideToast();
    try {
      const dirtyFields = formState.dirtyFields;
      const country = (countriesApi.getCountries() as Country[]).find(
        (v) => v.id.toString() === data.country
      );
      const state = dirtyFields.state
        ? countriesApi
            .getStates(selectedCountry?.id.toString() ?? profile?.country?.id!)
            .find((s) => s.id.toString() === data.state.toString())
        : profile?.state!;
      const city = cities.find((c) => c.id === data.city);

      const newProfile: Partial<Profile> = { id: user?.id!, userId: user?.id! };
      !!data.firstName && (newProfile.firstName = data.firstName);
      !!data.lastName && (newProfile.lastName = data.lastName);
      !!country && (newProfile.country = country);
      !!state && (newProfile.state = state);
      !!city && (newProfile.city = city);
      !!data.acceptMarketingFlag &&
        (newProfile.acceptMarketingFlag = data.acceptMarketingFlag);
      newProfile.updated = true;
      console.log(user.id, profile.id);

      await request<Profile>(() => updateProfile(newProfile as Profile));

      router.back();
      showToast({
        type: "success",
        message: t("changeSuccess"),
        options: {
          duration: 5000,
        },
      });
    } catch (err) {
      showToast({
        type: "error",
        code: (err as any).code,
        message: (err as any).message,
      });
    }
  };

  const focusToLastname = () => secondNameRef.current.focus();

  const values = useWatch({ control });

  const showMarketingTip = !profile?.updated && !values.acceptMarketingFlag;

  console.log(values.state);
  // return loader;
  return profile ? (
    <FormScreen style={styles.screen}>
      <KeyboardView>
        <ProfileHeader
          iconContainerStyle={styles.iconContainer}
          icon={{ color: theme.colors.grey }}
        />
      </KeyboardView>

      <TextInput
        ref={(nextInput) => (firstNameRef!.current = nextInput)}
        style={styles.rowItem}
        name="firstName"
        placeholder={t("firstName.placeholder")}
        returnKeyType="next"
        defaultValue={profile?.firstName}
        control={control}
        onSubmitEditing={focusToLastname}
        onEndEditing={focusToLastname}
      />

      <TextInput
        ref={(nextInput) => (secondNameRef!.current = nextInput)}
        style={styles.rowItem}
        name="lastName"
        placeholder={t("lastName.placeholder")}
        returnKeyType="next"
        defaultValue={profile?.lastName}
        control={control}
      />

      <TextInput
        disabled
        defaultValue={user?.email}
        name="email"
        placeholder={t("email.placeholder")}
        returnKeyType="next"
        control={control}
      />
      <Picker
        searchable
        placeholder={t("country.placeholder")}
        name="country"
        items={countries}
        defaultValue={profile?.country?.id.toString()}
        onChange={onCountryChange}
        control={control}
      />
      <View style={styles.rowContainer}>
        <Picker
          style={styles.location}
          searchable
          disabled={!states || states.length === 0 || !selectedCountry}
          placeholder={t("state.placeholder")}
          defaultValue={profile?.state?.id.toString()}
          onChange={onStateChange}
          name="state"
          items={states}
          control={control}
        />
        <Picker
          style={styles.location}
          searchable
          disabled={!cities || cities.length === 0 || !values.state}
          placeholder={t("city.placeholder")}
          defaultValue={profile?.city?.id.toString()}
          name="city"
          items={cities}
          control={control}
        />
      </View>

      {formState.errors.phone && <Error error={formState.errors.phone} />}
      {/* <TextInput
            name="interests"
            // defaultValue={profile?.interests}
            style={styles.rowItem}
            placeholder={t('interests.placeholder')}
            returnKeyType="next"
            control={control}
          /> */}

      <View style={styles.acceptMarketingContainer}>
        <CheckBox
          name="acceptMarketingFlag"
          label={t("marketingFlag.label")}
          defaultValue={profile?.acceptMarketingFlag}
          control={control}
          style={styles.acceptMarketingFlag}
        />
        {showMarketingTip && (
          <Tooltip text="Please opt-in for updates and news about the swap community on Mata" />
        )}
      </View>
      <Button
        // disabled={!formState.isDirty}
        title={t("submitBtnTitle")}
        onPress={handleSubmit(onFormSuccess)}
      />

      {loader}
    </FormScreen>
  ) : (
    <Loader />
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: "space-between",
    // backgroundColor: 'grey',
  },
  header: {
    // flex: 1,
    // backgroundColor: 'grey',
  },
  form: {
    flex: 4,
    justifyContent: "space-evenly",
    // backgroundColor: 'grey',
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowItem: {
    flexBasis: "48%",
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    // flexGrow: 1,
    // height: 100,
    // backgroundColor: 'red',
    justifyContent: "space-between",
  },
  location: {
    flexBasis: "48%",
  },
  phone: {
    flexBasis: "70%",
    // backgroundColor: 'red',
  },
  phoneCode: {
    flexBasis: "25%",
    // backgroundColor: 'grey',
  },
  iconContainer: {
    backgroundColor: theme.colors.lightGrey,
  },
  profileIcon: {
    color: theme.colors.dark,
  },

  acceptMarketingFlag: {
    // backgroundColor: 'yellow',
    marginBottom: 15,
  },
  acceptMarketingContainer: {
    // backgroundColor: 'yellow',
    // marginBottom: 15,
    zIndex: 1,
  },
});
