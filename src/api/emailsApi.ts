import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";

export interface Email extends Entity {
  subject: string;
  text: string;
  type: string;
  category?: string;
  metadata?: {
    dealId?: string;
    itemId?: string;
    url?: string;
    deviceOS?: string;
  };
}

class EmailsApi extends DatabaseApi<Email> {
  constructor() {
    super("emails");
  }
}

const emailsApi = new EmailsApi();

export default emailsApi;
