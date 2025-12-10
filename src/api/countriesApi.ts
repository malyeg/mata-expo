import { Country, State } from "@/models/place.model";
import countries from "../data/countries";
import states from "../data/states";

class CountriesApi {
  private countryList: Country[];
  constructor() {
    this.countryList = countries.map(this.countryMapper);
  }
  getAll = () => {
    return this.countryList;
  };
  getById = (id: string) => {
    return this.countryList.find((c) => c.id.toString() === id.toString());
  };

  private countryMapper(c: any) {
    const country: Country = {
      id: c.id.toString(),
      name: c.name,
      localizedName: c.localizedName,
      code: c.code,
      phoneCode: c.phoneCode,
      emoji: c.emoji,
    };
    return country;
  }

  private stateMapper(s: any) {
    const state: State = {
      id: s.id.toString(),
      name: s.name,
      localizedName: s.localizedName,
    };
    return state;
  }

  getCountries = () => {
    return this.getAll();
  };

  getStates = (countryId: string) => {
    let filteredStates = (states as any).filter(
      (state: any) =>
        state.country_id &&
        state.country_id?.toString() === countryId?.toString()
    );

    return filteredStates.map(this.stateMapper) as State[];
  };
  getStateById = (id: string) => {
    return (states as any).find(
      (state: State) => state.id.toString() === id.toString()
    );
  };
  getStatesByIds = (ids: string[]) => {
    return (states as any).filter((state: State) =>
      ids.includes(state.id.toString())
    ) as State[];
  };

  getByCode(countryCode: string) {
    const country = (countries as unknown as Country[]).find(
      (c) => c.code === countryCode
    );
    return this.countryMapper(country);
  }
  getStateByName(stateName: string, countryId: string) {
    const countryStates = this.getStates(countryId);
    let state = countryStates.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );
    if (!state) {
      state = countryStates.find((s) =>
        s.name.toLowerCase().includes(stateName.toLowerCase())
      );
    }
    if (!state) {
      state = countryStates.find(
        (s) =>
          stateName.toLowerCase().includes(s.name.toLowerCase()) ||
          s.name.toLowerCase().includes(stateName.toLowerCase())
      );
    }
    return state;
  }
}

const countriesApi = new CountriesApi();

export default countriesApi;
