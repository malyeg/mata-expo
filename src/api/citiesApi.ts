import { Country, State } from "@/models/place.model";
import { Entity, QueryBuilder } from "../types/DataTypes";
import { DataApi } from "./DataApi";
import { Coordinate } from "./locationApi";

export interface City extends Entity {
  id: string;
  name: string;
  stateId: string;
  coordinate: Coordinate;
}
class CitiesApi extends DataApi<City> {
  constructor() {
    super("cities");
  }

  getByStateId = async (stateId: string) => {
    console.log({ stateId });
    const query = new QueryBuilder<City>()
      .filter("stateId", Number(stateId))
      .limit(2000)
      .build();
    const cities = await this.getAll(query);
    if (cities) {
      cities.items = cities.items.map((c) => ({
        ...c,
        coordinate: {
          latitude: Number(c.coordinate.latitude),
          longitude: Number(c.coordinate.longitude),
        },
        id: c.id.toString(),
        stateId: c.stateId.toString(),
      }));
    }
    return cities;
  };

  async getByCountryIdAndStateId(countryId: string, stateId?: string) {
    const filters = [{ field: "countryId", value: Number(countryId) }];
    if (stateId) {
      filters.push({ field: "stateId", value: Number(stateId) });
    }
    const query = new QueryBuilder<City>().filters(filters).build();
    const cities = await this.getAll(query);
    if (cities) {
      cities.items = cities.items.map((c) => ({
        ...c,
        coordinate: {
          latitude: Number(c.coordinate.latitude),
          longitude: Number(c.coordinate.longitude),
        },
        id: c.id.toString(),
        stateId: c.stateId.toString(),
      }));
    }
    return cities;
  }

  async getByName(cityName: string, country: Country, state?: State) {
    const cities = await this.getByCountryIdAndStateId(country.id, state?.id);
    if (cities?.items && cities?.items?.length > 0) {
      return cities.items.filter(
        (c) => c.name?.toLowerCase() === cityName.toLowerCase()
      );
    }
  }
}

const citiesApi = new CitiesApi();

export default citiesApi;
