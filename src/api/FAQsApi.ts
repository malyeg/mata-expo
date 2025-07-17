import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface Question {
  question: string;
  answer: string;
  links?: {label: string; url: string}[];
}
export interface FAQ extends Entity {
  id: string;
  groupName: string;
  questions: Question[];
}

class FAQsApi extends DataApi<FAQ> {
  constructor() {
    super('faqs');
  }
}

const faqsApi = new FAQsApi();

export default faqsApi;
