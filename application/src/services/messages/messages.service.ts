import { Injectable } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessagesService {
  constructor(private databaseService: DatabaseService) {}
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
      await this.databaseService.pool.query(`
      do $$
declare
message_id uuid;

begin	
insert into messages("content", user_id, image_url, image_asset_id)
values('${payload.content}', '${payload.user_id}', '${payload.image_url}', '${payload.image_asset_id}')
returning id into message_id;

insert into channel_messages (channel_id, message_id)
values('${payload.channel_id}', message_id);
end $$;`);
    } catch (error) {
      throw error;
    }
  }

  async loadMessages(channel_id: string) {
    try {
      const msg = await this.databaseService.pool.query(
        `select * from channel_messages as cm
join messages as m on m.id = cm.message_id 
join users as u on u.id = m.user_id 
where cm.channel_id = $1
order by m.created_at asc
`,
        [channel_id],
      );
      return msg.rows;
    } catch (error) {
      throw error;
    }
  }

  async pinMessage(messageId: string, channel_id: string) {
    try {
      const channelExists = await this.databaseService.pool.query(
        ` SELECT EXISTS(SELECT 1 FROM channels WHERE id = $1)`,
        [channel_id],
      );

      const messageExists = await this.databaseService.pool.query(
        `SELECT EXISTS(SELECT 1 FROM messages WHERE id = $1)`,
        [messageId],
      );

      if (channelExists.rows[0].exists && messageExists.rows[0].exists) {
        await this.databaseService.pool.query(
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
      const pinnedMessages = await this.databaseService.pool.query(
        `select * from pinned_messages as pm
join messages as m on m.id = pm.messages_id
join users on users.id = m.user_id 
where pm.channel_id = $1
`,
        [channelId],
      );
      return {
        data: pinnedMessages.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
