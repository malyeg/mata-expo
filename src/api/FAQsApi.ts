import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";

export interface Question {
  question: string;
  answer: string;
  links?: { label: string; url: string }[];
}
export interface FAQ extends Entity {
  id: string;
  groupName: string;
  questions: Question[];
}

class FAQsApi extends DatabaseApi<FAQ> {
  constructor() {
    super("faqs");
  }
}

const faqsApi = new FAQsApi();

export default faqsApi;
