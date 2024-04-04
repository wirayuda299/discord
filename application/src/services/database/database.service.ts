import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  pool: Pool;
  constructor() {
    this.pool = new Pool({
      connectionString: 'jdbc://postgres:postgres@localhost:5432/postgres',
    });
  }
}
