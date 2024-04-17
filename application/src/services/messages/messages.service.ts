import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}
  async sendMessage(
    @MessageBody()
    payload: {
      content: string;
      is_read: boolean;
      user_id: string;
      created_at: string;
      username: string;
      channel_id: string;
      image_url?: string;
      image_asset_id?: string;
    },
  ) {
    try {
      await this.db.pool.query('BEGIN');

      try {
        const {
          rows: [message],
        } = await this.db.pool.query(
          `INSERT INTO messages("content", user_id, image_url, image_asset_id)
       VALUES($1, $2, $3, $4)
       RETURNING id`,
          [
            payload.content,
            payload.user_id,
            payload.image_url ?? '',
            payload.image_asset_id ?? '',
          ],
        );

        const messageId = message.id;

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

  async replyMessage(messageId: string, content: string, user_id: string) {
    try {
      await this.db.pool.query(
        `insert into messages_replies (message_id, "content", user_id)
   values($1,$2,$3)`,
        [messageId, content, user_id],
      );
    } catch (error) {
      throw error;
    }
  }

  async getMessageByChannelId(channel_id: string, serverId: string) {
    try {
      const msg = await this.db.pool.query(
        `SELECT
          cm.message_id AS message_id,
          m.content AS message,
          m.user_id AS author_id,
          m.is_read AS is_read,
          m.image_url AS media_image,
          m.image_asset_id AS media_image_id,
          m.created_at AS msg_created_at,
          sp.username AS author_name,
          sp.user_id AS author_id,
          sp.avatar AS author_image
      FROM
          channel_messages AS cm
      JOIN
          messages AS m ON m.id = cm.message_id
      JOIN
          server_profile AS sp ON sp.user_id = m.user_id AND sp.server_id = $1
      WHERE
          cm.channel_id = $2
      ORDER BY
          m.created_at ASC;`,
        [serverId, channel_id],
      );

      const messagesWithReactions = [];

      for (const message of msg.rows) {
        const reactions = await this.db.pool.query(
          `SELECT * FROM reactions
        WHERE message_id = $1`,
          [message.message_id],
        );
        message.reactions = reactions.rows;

        messagesWithReactions.push(message);
      }

      for (const message of msg.rows) {
        const replies = await this.db.pool.query(
          `SELECT
      mr.id AS reply_id,
      mr.message_id AS message_id,
      mr.content AS message,
      mr.user_id AS author_id,
      mr.is_read AS is_read,
      mr.image_url AS media_image,
      mr.image_asset_id AS media_image_id,
      mr.created_at AS msg_created_at,
      sp.username AS author_name,
      sp.user_id AS author_id,
      sp.avatar AS author_image
    FROM
      messages_replies AS mr
    JOIN
      server_profile AS sp ON sp.user_id = mr.user_id AND sp.server_id = $1
    WHERE mr.message_id = $2
    ORDER BY msg_created_at ASC`,
          [serverId, message.message_id],
        );

        for (const reply of replies.rows) {
          const replyReactions = await this.db.pool.query(
            `SELECT * FROM reactions
      WHERE message_id = $1`,
            [reply.reply_id],
          );
          reply.reactions = replyReactions.rows;
          messagesWithReactions.push(reply);
        }
      }
      for (const message of messagesWithReactions) {
        if (message.reply_id) {
          const repliesOfReplies = await this.db.pool.query(
            `SELECT
   mr.id AS reply_id,
   mr.message_id AS message_id,
   mr.content AS message,
   mr.user_id AS author_id,
   mr.is_read AS is_read,
   mr.image_url AS media_image,
   mr.image_asset_id AS media_image_id,
   mr.created_at AS msg_created_at,
   sp.username AS author_name,
   sp.user_id AS author_id,
   sp.avatar AS author_image
 FROM
   messages_replies AS mr
 JOIN
   server_profile AS sp ON sp.user_id = mr.user_id AND sp.server_id = $1
 WHERE mr.message_id = $2
 ORDER BY msg_created_at ASC`,
            [serverId, message.reply_id],
          );
          if (repliesOfReplies.rows.length >= 1) {
            for (const replyOfReply of repliesOfReplies.rows) {
              const replyOfReplyReactions = await this.db.pool.query(
                `SELECT * FROM reactions
     WHERE message_id = $1`,
                [replyOfReply.reply_id],
              );
              replyOfReply.reactions = replyOfReplyReactions.rows;
              messagesWithReactions.push(replyOfReply);
            }
          }
        }
      }

      messagesWithReactions.sort(
        (a, b) =>
          new Date(a.msg_created_at).getTime() -
          new Date(b.msg_created_at).getTime(),
      );

      return {
        data: messagesWithReactions,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async pinMessage(messageId: string, channel_id: string, pinnedBy: string) {
    try {
      const channelExists = await this.db.pool.query(
        `SELECT EXISTS(SELECT 1 FROM channels WHERE id = $1)`,
        [channel_id],
      );

      const messageExists = await this.db.pool.query(
        `SELECT EXISTS(SELECT 1 FROM messages WHERE id = $1)`,
        [messageId],
      );
      if (!channelExists.rows[0].exists || !messageExists.rows[0].exists) {
        throw new HttpException(
          'Message or channel doesnt exists',
          HttpStatus.NOT_FOUND,
        );
      }
      const isAlreadyPinned = await this.db.pool.query(
        `select * from channel_pinned_messages
        where messages_id = $1`,
        [messageId],
      );

      if (isAlreadyPinned.rows.length >= 1) {
        throw new HttpException(
          'Message already pinned',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.db.pool.query(
          `INSERT INTO channel_pinned_messages(messages_id, channel_id, pinned_by) 
          VALUES($1,$2, $3)`,
          [messageId, channel_id, pinnedBy],
        );
        return {
          message: 'Message pinned',
          error: false,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getPinnedMessages(channelId: string) {
    try {
      const pinnedMessages = await this.db.pool.query(
        `select * from channel_pinned_messages as pm
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

  async editMessage(
    messageAuthor: string,
    currentUser: string,
    messageId: string,
    content: string,
  ) {
    try {
      if (messageAuthor !== currentUser) {
        throw new HttpException(
          'You are not allowed to edit this message',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const message = await this.db.pool.query(
        `select * from messages where id = $1`,
        [messageId],
      );

      if (message.rows.length < 1) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      await this.db.pool.query(
        `
update messages
set content = $1,
    updated_at = NOW()
where id = $2
`,
        [content, messageId],
      );
      return {
        message: 'Message updated',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
