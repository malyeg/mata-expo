import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface Email extends Entity {
  subject: string;
  text: string;
  type: string;
  metadata?: {
    dealId?: string;
    itemId?: string;
    url?: string;
    deviceOS?: string;
  };
}

class EmailsApi extends DataApi<Email> {
  constructor() {
    super('emails');
  }
}

const emailsApi = new EmailsApi();

export default emailsApi;
