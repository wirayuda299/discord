import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ThreadsService {
  constructor(private db: DatabaseService) {}

  async createThread(message_id: string, user_id: string, name?: string) {
    try {
      await this.db.pool.query(
        `insert into threads(name, message_id,user_id)
      values($1,$2,$3)`,
        [name ?? '', message_id, user_id],
      );
      return {
        message: 'Threads has been created',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
