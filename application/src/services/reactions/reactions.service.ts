import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReactionsService {
  constructor(private db: DatabaseService) {}

  async addOrRemoveReactions(
    message_id: string,
    emoji: string,
    unified_emoji: string,
    react_by: string,
  ) {
    try {
      const existingReaction = await this.db.pool.query(
        `
      select * from reactions as r
      where r.react_by= $1 and r.unified_emoji = $2
      `,
        [react_by, unified_emoji],
      );

      if (existingReaction.rows.length >= 1) {
        await this.db.pool.query(
          `delete from reactions
        where react_by = $1 and unified_emoji = $2
        `,
          [react_by, unified_emoji],
        );
      } else {
        await this.db.pool.query(
          `
        insert into reactions(message_id, emoji, unified_emoji, react_by)
        values($1, $2, $3, $4)
        `,
          [message_id, emoji, unified_emoji, react_by],
        );
      }

      return {
        message: 'added',
        error: false,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
