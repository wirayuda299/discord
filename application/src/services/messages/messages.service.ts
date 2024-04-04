import { Injectable } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}
  async sendMessage(
    @MessageBody()
    payload: {
      channel_id: string;
      message_id: string;
      id: string;
      content: string;
      is_read: boolean;
      user_id: string;
      image_url: string | null;
      image_asset_id: string | null;
      created_at: string;
      updated_at: string;
      username: string;
      email: string;
      image: string;
    },
  ) {
    try {
      // Start the transaction
      await this.db.pool.query('BEGIN');

      try {
        // Insert into messages and get the message_id
        const {
          rows: [message],
        } = await this.db.pool.query(
          `INSERT INTO messages("content", user_id, image_url, image_asset_id)
         VALUES($1, $2, $3, $4)
         RETURNING id`,
          [
            payload.content,
            payload.user_id,
            payload.image_url,
            payload.image_asset_id,
          ],
        );

        const messageId = message.id;

        // Insert into channel_messages
        await this.db.pool.query(
          `INSERT INTO channel_messages (channel_id, message_id)
         VALUES($1, $2)`,
          [payload.channel_id, messageId],
        );

        await this.db.pool.query('COMMIT');
      } catch (e) {
        await this.db.pool.query('ROLLBACK');
        throw e;
      }
    } catch (error) {
      throw error;
    }
  }

  async loadMessages(channel_id: string) {
    try {
      const msg = await this.db.pool.query(
        `select * from channel_messages as cm
join messages as m on m.id = cm.message_id 
join users as u on u.id = m.user_id 
where cm.channel_id = $1
order by m.created_at asc`,
        [channel_id],
      );
      return msg;
    } catch (error) {
      throw error;
    }
  }

  async pinMessage(messageId: string, channel_id: string) {
    try {
      const channelExists = await this.db.pool.query(
        ` SELECT EXISTS(SELECT 1 FROM channels WHERE id = $1`,
        [channel_id],
      );

      const messageExists = await this.db.pool.query(
        `SELECT EXISTS(SELECT 1 FROM messages WHERE id = $1)`,
        [messageId],
      );

      if (channelExists[0].exists && messageExists[0].exists) {
        await this.db.pool.query(
          `INSERT INTO pinned_messages(channel_id, messages_id) VALUES($1, $2)
`,
          [channel_id, messageId],
        );

        return {
          message: 'Message pinned',
          error: false,
        };
      } else {
        throw new Error('Channel or message does not exist');
      }
    } catch (error) {
      throw error;
    }
  }

  async getPinnedMessages(channelId: string) {
    try {
      const pinnedMessages = await this.db.pool.query(
        `select * from pinned_messages as pm
join messages as m on m.id = pm.messages_id
join users on users.id = m.user_id 
where pm.channel_id = $1
`,
        [channelId],
      );
      return {
        data: pinnedMessages,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
