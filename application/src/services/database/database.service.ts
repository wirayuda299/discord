import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

//  database: 'postgres',
//       user: 'postgres',
//       password: 'postgres',
//       host: 'localhost',
//       port: 5432,
@Injectable()
export class DatabaseService {
  readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.connectToDb();
  }

  async connectToDb() {
    try {
      return await this.pool.connect();
    } catch (error) {
      throw error;
    }
  }
}
