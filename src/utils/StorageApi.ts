import AsyncStorage from '@react-native-async-storage/async-storage';

// const logger = LoggerFactory.getLogger('StorageApi');
class StorageApi {
  readonly keys: Set<string>;
  constructor() {
    this.keys = new Set();
  }

  async get<T extends any>(key: string) {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  }
  async add(key: string, value: any) {
    let newValue = value;
    if (typeof value !== 'string') {
      newValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, newValue);
    this.keys.add(key);
  }
  async remove(key: string) {
    await AsyncStorage.removeItem(key);
    this.keys.delete(key);
  }
  async clear() {
    this.keys.forEach(async key => {
      await AsyncStorage.removeItem(key);
    });
    this.keys.clear();
  }
}

const storageApi = new StorageApi();

export default storageApi;
