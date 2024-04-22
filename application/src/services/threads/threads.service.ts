import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { groupReactionsByEmoji } from 'src/utils/groupMessageByEmoji';

@Injectable()
export class ThreadsService {
  constructor(private db: DatabaseService) {}

  async sendThreadMessage(
    message: string,
    user_id: string,
    imageUrl: string,
    imageAssetId: string,
    threadId: string,
  ) {
    try {
      const {
        rows: [threadMessage],
      } = await this.db.pool.query(
        `insert into messages ("content", user_id, "type", image_url, image_asset_id)
         VALUES($1, $2, $3, $4,$5)
         returning id;
         `,
        [message, user_id, 'threads', imageUrl, imageAssetId],
      );
      await this.db.pool.query(
        `insert into thread_messages (message_id, thread_id)
         VALUES($1, $2)`,
        [threadMessage.id, threadId],
      );
    } catch (error) {
      throw error;
    }
  }

  async createThread(
    message_id: string,
    user_id: string,
    imageUrl: string = '',
    imageAssetId: string = '',
    message: string,
    channelId: string,
    name: string = '',
  ) {
    try {
      await this.db.pool.query('begin');
      const {
        rows: [thread],
      } = await this.db.pool.query(
        `insert into threads (message_id, author, name, channel_id)
        values($1,$2,$3, $4)
        returning id
        `,
        [message_id, user_id, name, channelId],
      );

      await this.sendThreadMessage(
        message,
        user_id,
        imageUrl,
        imageAssetId,
        thread.id,
      );

      await this.db.pool.query('commit');

      return {
        message: 'Threads has been created',
        error: false,
      };
    } catch (error) {
      await this.db.pool.query('rollback');
      throw error;
    }
  }

  private async getReactions(messageId: string) {
    try {
      const reactions = await this.db.pool.query(
        `SELECT * FROM reactions WHERE message_id = $1`,
        [messageId],
      );
      return reactions.rows;
    } catch (error) {
      throw error;
    }
  }

  private async getReplies(
    threadId: string,
    serverId: string,
    parentMessageId: string,
  ) {
    try {
      const allReplies = [];

      const replies = await this.db.pool.query(
        `SELECT 
          tmr.thread_id AS thread_id,
          m.content AS message,
          m.is_read as is_read,
          tmr.parent_message_id AS parent_message_id,
          m.id as message_id,
          m.user_id AS author_id,
          m.image_url AS media_image,
          m.type AS message_type,
          m.image_asset_id AS media_image_asset_id,
          m.created_at,
          m.updated_at,
          sp.username AS username
        FROM messages AS m
        JOIN thread_messages_replies AS tmr ON m.id = tmr.message_id
        JOIN server_profile AS sp ON m.user_id = sp.user_id AND sp.server_id = $2
        WHERE 
          tmr.thread_id = $1 AND tmr.parent_message_id = $3
        ORDER BY 
          m.created_at ASC`,
        [threadId, serverId, parentMessageId],
      );

      for (const reply of replies.rows) {
        const reactions = await this.getReactions(reply.message_id);
        reply.reactions = reactions;

        allReplies.push(reply);
        const subReplies = await this.getReplies(
          threadId,
          serverId,
          reply.message_id,
        );

        for (const subReply of subReplies) {
          const duplicate = subReplies.find(
            (r) => r.reply_id === subReply.message_id,
          );
          if (!duplicate) {
            allReplies.push(subReply);
          }
        }
      }

      return allReplies;
    } catch (error) {
      throw error;
    }
  }

  async getThreadMessage(threadId: string, serverId: string) {
    try {
      const allThreads = [];
      const threads = await this.db.pool.query(
        `
        select
        sp.username as username,
        sp.user_id as author_id,
        t.name as thread_name,
        t.id as thread_id,
        t.channel_id as channel_id,
        m."content" as message,
        m.is_read as is_read,
        m.id as message_id,
        m.user_id as author,
        m.image_url as media_image,
        m."type" as message_type,
        m.image_asset_id as media_image_asset_id,
        m.created_at as created_at,
        m.updated_at as update_at
        from threads as t
        join thread_messages as tm on t.id = tm.thread_id
        join server_profile as sp on sp.user_id = t.author and sp.server_id = $2
        join messages as m on m.id = tm.message_id 
        where t.id = $1
        `,
        [threadId, serverId],
      );

      for await (const message of threads.rows) {
        const reactions = await this.getReactions(message.message_id);
        message.reactions = reactions;
        allThreads.push(message);

        const replies = await this.getReplies(
          threadId,
          serverId,
          message.message_id,
        );

        allThreads.push(...replies.flat());
      }

      return allThreads;
    } catch (error) {
      throw error;
    }
  }

  async replyThreadMessage(
    parentMessageId: string,
    threadId: string,
    content: string,
    user_id: string,
    imageUrl: string,
    imageAssetId: string,
  ) {
    try {
      await this.db.pool.query('begin');

      const {
        rows: [msg],
      } = await this.db.pool.query(
        `insert into messages ("content", user_id, "type", image_url,image_asset_id)
        values($1, $2, 'threads', $3,$4)
        returning id;`,
        [content, user_id, imageUrl, imageAssetId],
      );
      await this.db.pool.query(
        `insert into thread_messages_replies (parent_message_id,  message_id, thread_id)
	      values($1, $2, $3);`,
        [parentMessageId, msg.id, threadId],
      );

      await this.db.pool.query('commit');
    } catch (error) {
      await this.db.pool.query('rollback');
      throw error;
    }
  }

  async getAllThreads(channelId: string, serverId: string) {
    try {
      const allThreads = await this.db.pool.query(
        `select 
        t.id as thread_id,
        t.message_id as message_id,
        t.author as author,
        t."name" as thread_name,
        sp.username as username,
        sp.avatar as avatar,
        t.channel_id as channel_id
        from threads as t
        join server_profile as sp on sp.user_id = t.author and sp.server_id = $2
        where t.channel_id = $1`,
        [channelId, serverId],
      );

      const threads = groupReactionsByEmoji(allThreads.rows);

      return {
        data: threads,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
