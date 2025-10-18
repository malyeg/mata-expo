import {Entity} from '../types/DataTypes';

const complainTypesList = [
  'Burglary',
  'Child Abuse',
  'Crime',
  'Drugs',
  'Extremism',
  'Gambling',
  'Grooming',
  'Hate',
  'Harrassment',
  'Human Trafficking',
  'Objectionable Material',
  'Pornography / Sex',
  'Prostitution',
  'Scam',
  'Terrorism',
  'Violence',
  'Weapons',
];

const complainTypes = complainTypesList.map(c => ({id: c, name: c} as Entity));

export default complainTypesList;
export {complainTypes};
