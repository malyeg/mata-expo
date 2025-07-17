import { Coordinate } from "@/api/locationApi";
import { Entity } from "@/types/DataTypes";

export interface City extends Entity {
  id: string;
  name: string;
  stateId: string;
  coordinate: Coordinate;
}

export interface Country extends Entity {
  id: string;
  name: string;
  code: string;
  phoneCode: string;
  emoji: string;
}

export interface State extends Entity {
  id: string;
  name: string;
  code?: string;
  coordinate?: Coordinate;
}
