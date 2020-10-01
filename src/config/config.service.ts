import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  MONGODB_URI: string;
  private readonly envConfig: { [key: string]: string };

  constructor() {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'
    ) {
      this.envConfig = {
        MONGODB_URI: process.env.MONGODB_URI,
        FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET
      };
    } else {
      this.envConfig = dotenv.parse(fs.readFileSync('.env'));
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
