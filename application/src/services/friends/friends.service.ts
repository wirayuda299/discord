import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FriendsService {
  constructor(private db: DatabaseService) {}

  async getFriends(userId: string) {
    try {
      const friends = await this.db.pool.query(
        `SELECT
          u.id as user_id,
          u.username as username,
          u.image as image,
          u.created_at as created_at
          FROM friends as f
          join users as u on f.friend_id = u.id
          WHERE user_id = $1
          UNION
          SELECT
           u.id as user_id,
          u.username as username,
          u.image as image,
          u.created_at as created_at
          FROM friends as f
            join users as u on f.user_id = u.id
          WHERE friend_id = $1;`,
        [userId],
      );
      return {
        data: friends.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
