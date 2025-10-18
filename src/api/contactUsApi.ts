import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";

export interface email extends Entity {
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
}

class ContactUsApi extends DatabaseApi<email> {
  constructor() {
    super("emails");
  }
}

const contactUsApi = new ContactUsApi();

export default contactUsApi;
