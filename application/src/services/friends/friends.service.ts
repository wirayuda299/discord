import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FriendsService {
  constructor(private databaseService: DatabaseService) {}

  async addFriend(followerId: string, userId: string) {
    try {
      await this.databaseService.pool
        .query(
          `BEGIN;
INSERT INTO followers_detail(followerId, currentUserId) VALUES('${userId}', '${followerId}');
INSERT INTO followings_detail(followingUserId, currentUserId) VALUES('${userId}', '${followerId}');
COMMIT;`,
        )
        .then(() => {
          return {
            message: 'Added',
            error: false,
          };
        });
    } catch (error) {
      await this.databaseService.pool.query('ROLLBACK;');
      throw error;
    }
  }
  async removeFriend(followerId: string, userId: string) {
    try {
      await this.databaseService.pool
        .query(
          `BEGIN;
DELETE FROM followers_detail
WHERE followerId = '${userId}' AND currentUserId = '${followerId}';
DELETE FROM followings_detail
WHERE followingUserId = '${userId}' AND currentUserId = '${followerId}';
COMMIT;`,
        )
        .then(() => {
          return {
            message: 'Added',
            error: false,
          };
        })
        .catch((e) => {
          throw new Error(e);
        });
    } catch (error) {
      throw error;
    }
  }

  async getFollowing(id: string) {
    try {
      const following = await this.databaseService.pool.query(`SELECT u.*
FROM followings_detail fd
JOIN users u ON fd.followingUserId = u.id
WHERE fd.currentuserId  = '${id}'`);

      return {
        data: following.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
