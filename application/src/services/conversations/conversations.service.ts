import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ConversationsService {
  constructor(private db: DatabaseService) {}

  async getUserConversations(userId: string) {
    try {
      const conversations = await this.db.pool.query(
        `
      select 
      c.created_at as created_at,
      c.id as conversation_id,
      c.recipient_id as recipient_id,
      c.sender_id  as sender_id ,
      u.username as username, 
      u.image as image
      from conversations as c
      join users as u on u.id = c.recipient_id 
      where c.sender_id = $1
      union 
      select 
      c.created_at as created_at,
      c.id as conversation_id,
      c.sender_id  as sender_id ,
      c.recipient_id as recipient_id,
      u.username as username, 
      u.image as image
      from conversations as c
      join users as u on u.id = c.sender_id  
      where c.recipient_id = $1
      `,
        [userId]
      );

      return {
        data: conversations.rows,
        error: false,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
