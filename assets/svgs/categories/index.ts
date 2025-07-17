import {SvgProps} from 'react-native-svg';
import animal from './icAnimal.svg';
import antique from './icAntiques.svg';
import apparel from './icApparel.svg';
import art from './icArts.svg';
import baby from './icBaby.svg';
import beauty from './icBeauty.svg';
import business from './icBusiness.svg';
import camera from './icCameras.svg';
import computer from './icComputers.svg';
import construction from './icConstruction.svg';
import electronic from './icElectronics.svg';
import food from './icFood.svg';
import furniture from './icFurniture.svg';
import garden from './icGarden.svg';
import hardware from './icHardware.svg';
import luggage from './icLuggage.svg';
import media from './icMedia.svg';
import mobile from './icMobile.svg';
import office from './icOffice.svg';
import other from './icOther.svg';
import religious from './icReligious.svg';
import software from './icSoftware.svg';
import sport from './icSports.svg';
import toy from './icToys.svg';
import vehicle from './icVehicles.svg';

import React from 'react';

interface SvgIconsType {
  [key: string]: React.FC<SvgProps>;
}
export const CategoryIcons: SvgIconsType = {
  animal,
  antique,
  apparel,
  art,
  baby,
  beauty,
  business,
  camera,
  computer,
  construction,
  electronic,
  food,
  furniture,
  garden,
  hardware,
  luggage,
  media,
  mobile,
  office,
  religious,
  software,
  sport,
  toy,
  vehicle,
  other,
};
