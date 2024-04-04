import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FriendsService {
  constructor(private db: DatabaseService) {}

  async getFriends(userId: string) {
    try {
      const friends = await this.db.pool.query(
        `select * from friends as f
join users as u on u.id = f.friend_id  
where f.user_id  = $1`,
        [userId],
      );
      return {
        data: friends,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
