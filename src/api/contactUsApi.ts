import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface email extends Entity {
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
}

class ContactUsApi extends DataApi<email> {
  constructor() {
    super('emails');
  }
}

const contactUsApi = new ContactUsApi();

export default contactUsApi;
