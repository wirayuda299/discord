import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { DatabaseService } from '../database/database.service';
import { groupReactionsByEmoji } from '../../common/utils/groupMessageByEmoji';
import { RolesService } from '../roles/roles.service';

export type Permission = {
  role_id: string;
  permission_id: string;
  id: string;
  manage_channel: boolean;
  manage_role: boolean;
  kick_member: boolean;
  ban_member: boolean;
  attach_file: boolean;
  manage_thread: boolean;
  manage_message: boolean;
};
export interface Role {
  id: string;
  name: string;
  serverId: string;
  role_color: string;
  icon: string;
  icon_asset_id: string;
  members: any[];
  permissions: Permission;
}

export type Thread = {
  username: string;
  author_id: string;
  thread_name: string;
  thread_id: string;
  channel_id: string;
  message: string;
  is_read: boolean;
  author: string;
  media_image: string;
  message_type: string;
  media_image_asset_id: string;
  created_at: string;
  update_at: string;
};

export interface Message {
  message_id: string;
  message: string;
  is_read: boolean;
  author: string;
  media_image: string;
  message_type: string;
  media_image_asset_id: string;
  created_at: string;
  update_at: string;
  username: string;
  shouldAddLabel: boolean;
  parent_message_id: string;
  threads: Thread[];
  reactions: {
    emoji: string;
    unified_emoji: string;
    count: number;
  }[];
  reply_id?: string;
  thread_name?: string;
  role: Role | undefined;
}

type Props = Message & { shouldAddLabel: boolean };

@Injectable()
export class MessagesService {
  constructor(
    private db: DatabaseService,
    private roleService: RolesService
  ) {}

  addLabelsToMessages(messages: Message[]) {
    let currentMonth: number | null = null;

    return messages?.map((message) => {
      const messageDate = new Date(message.created_at);
      const messageMonth = messageDate.getMonth();

      const shouldAddLabel = currentMonth !== messageMonth;

      currentMonth = messageMonth;

      return { ...message, shouldAddLabel };
    });
  }

  async getReactions(messageId: string) {
    try {
      const reactions = await this.db.pool.query(
        `SELECT * FROM reactions WHERE message_id = $1`,
        [messageId]
      );
      return reactions.rows;
    } catch (error) {
      throw error;
    }
  }

  async getReplies(
    parentMessageId: string,
    channelId: string,
    serverId: string
  ): Promise<Props[]> {
    try {
      const replies = await this.db.pool.query(
        `SELECT
        mr.parent_message_id as parent_message_id,
        mr.id as reply_id,
        mr.author as author_id,
        m."content" as message,
        m.id as message_id,
        m.is_read as is_read,
        m.user_id as author,
        m.image_url as media_image,
        m."type" as message_type,
        m.image_asset_id as media_image_asset_id,
        m.created_at as created_at,
        m.updated_at as update_at,
        sp.username as username
        FROM messages_replies as mr 
        JOIN messages as m ON m.id = mr.message_id
        JOIN server_profile as sp ON sp.user_id = m.user_id AND  sp.server_id = $2
        WHERE mr.parent_message_id = $1 
        ORDER BY m.created_at ASC`,
        [parentMessageId, serverId]
      );

      const allReplies: Props[] = [];

      for await (const reply of replies.rows) {
        const reactions = await this.getReactions(reply.message_id);
        reply.reactions = reactions;
        const role = await this.roleService.getCurrentUserRole(
          reply.user_id,
          serverId
        );

        reply.role = role;
        const threads = await this.db.pool.query(
          `select
          sp.username as username,
          sp.user_id as author_id,
          t.name as thread_name,
          t.id as thread_id,
          t.channel_id as channel_id
          from threads as t
          join server_profile as sp on sp.user_id = t.author and sp.server_id = $2
          where t.message_id = $1
        `,
          [reply.message_id, serverId]
        );

        reply.threads = threads.rows || [];

        const subReplies = await this.getReplies(
          reply.message_id,
          channelId,
          serverId
        );

        for (const subReply of subReplies) {
          const reactions = await this.getReactions(subReply.message_id);

          subReply.reactions = reactions;
        }

        allReplies.push(...subReplies, reply);
      }

      return allReplies;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    @MessageBody()
    payload: {
      content: string;
      is_read: boolean;
      user_id: string;
      username: string;
      channelId: string;
      imageUrl: string;
      imageAssetId: string;
    }
  ) {
    try {
      await this.db.pool.query('BEGIN');

      try {
        const {
          rows: [message],
        } = await this.db.pool.query(
          `INSERT INTO messages(content, user_id, image_url, image_asset_id, type)
           VALUES($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            payload.content,
            payload.user_id,
            payload.imageUrl ?? '',
            payload.imageAssetId ?? '',
            'channel',
          ]
        );

        const messageId = message.id;

        await this.db.pool.query(
          `INSERT INTO channel_messages (channel_id, message_id)
       VALUES($1, $2)`,
          [payload.channelId, messageId]
        );

        await this.db.pool.query('COMMIT');
      } catch (e) {
        await this.db.pool.query('ROLLBACK');
        throw e;
      }
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async replyMessage(
    parentMessageId: string,
    content: string,
    user_id: string,
    imageUrl: string = '',
    imageAssetId: string = '',
    type: string
  ) {
    try {
      await this.db.pool.query('begin');
      const {
        rows: [message],
      } = await this.db.pool.query(
        `INSERT INTO messages("content", user_id, image_url, image_asset_id, type)
       VALUES($1, $2, $3, $4, $5)
       returning id`,
        [content, user_id, imageUrl, imageAssetId, type]
      );

      await this.db.pool.query(
        `insert into messages_replies (parent_message_id, author, message_id)
        values($1,$2,$3)`,
        [parentMessageId, user_id, message.id]
      );
      await this.db.pool.query('commit');
    } catch (error) {
      await this.db.pool.query('rollback');
      throw error;
    }
  }

  async getThreadByMessage(messageId: string, serverId: string) {
    try {
      const threads = await this.db.pool.query(
        `
          select
          sp.username as username,
          sp.user_id as author_id,
          t.name as thread_name,
          t.id as thread_id,
          t.channel_id as channel_id
          from threads as t
          join server_profile as sp on sp.user_id = t.author and sp.server_id = $2
          where t.message_id = $1
        `,
        [messageId, serverId]
      );

      for await (const thread of threads.rows) {
        const role = await this.roleService.getCurrentUserRole(
          thread.author_id,
          serverId
        );

        thread.role = role;
      }

      return threads.rows;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async getMessageByChannelId(channel_id: string, serverId: string) {
    try {
      const messagesWithReactions = [];

      const messages = await this.db.pool.query(
        `
        SELECT 
        cm.message_id AS message_id,
        m."content" AS message,
        m.is_read AS is_read,
        m.user_id AS author,
        m.image_url AS media_image,
        m."type" AS message_type,
        m.image_asset_id AS media_image_asset_id,
        m.created_at AS created_at,
        m.updated_at AS update_at,
        sp.username AS username
        FROM channel_messages AS cm
        JOIN messages AS m ON m.id = cm.message_id 
        JOIN server_profile AS sp ON sp.user_id = m.user_id AND sp.server_id = $1
        WHERE cm.channel_id = $2 AND m.type = 'channel'
        ORDER BY m.created_at ASC
      `,
        [serverId, channel_id]
      );

      for await (const message of messages.rows) {
        const reactions = await this.getReactions(message.message_id);
        const threads = await this.getThreadByMessage(
          message.message_id,
          serverId
        );

        const role = await this.roleService.getCurrentUserRole(
          message.author,
          serverId
        );

        message.role = role;
        message.threads = threads || [];
        message.reactions = reactions;
        messagesWithReactions.push(message);

        const replies = await this.getReplies(
          message.message_id,
          channel_id,
          serverId
        );

        messagesWithReactions.push(...replies);
      }

      messagesWithReactions.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const groupedMessages = groupReactionsByEmoji(messagesWithReactions);
      const allMessages = this.addLabelsToMessages(groupedMessages);

      return allMessages;
    } catch (error) {
      throw error;
    }
  }

  async pinMessage(messageId: string, channel_id: string, pinnedBy: string) {
    try {
      const channelExists = await this.db.pool.query(
        `SELECT EXISTS(SELECT 1 FROM channels WHERE id = $1)`,
        [channel_id]
      );

      console.log(channelExists.rows);

      const messageExists = await this.db.pool.query(
        `SELECT EXISTS(SELECT 1 FROM messages WHERE id = $1)`,
        [messageId]
      );

      if (!channelExists.rows[0].exists || !messageExists.rows[0].exists) {
        throw new HttpException(
          "Message or channel doesn't exists",
          HttpStatus.NOT_FOUND
        );
      }
      const isAlreadyPinned = await this.db.pool.query(
        `select * from channel_pinned_messages
        where message_id = $1`,
        [messageId]
      );

      if (isAlreadyPinned.rows.length >= 1) {
        throw new HttpException(
          'Message already pinned',
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.db.pool.query(
          `INSERT INTO channel_pinned_messages(message_id, channel_id, pinned_by) 
          VALUES($1,$2, $3)`,
          [messageId, channel_id, pinnedBy]
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
          join messages as m on m.id = pm.message_id
          join users on users.id = m.user_id 
          where pm.channel_id = $1`,
        [channelId]
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
    content: string
  ) {
    try {
      if (messageAuthor !== currentUser) {
        throw new HttpException(
          'You are not allowed to edit this message',
          HttpStatus.UNAUTHORIZED
        );
      }
      const message = await this.db.pool.query(
        `select * from messages where id = $1`,
        [messageId]
      );

      if (message.rows.length < 1) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      await this.db.pool.query(
        `update messages
        set content = $1,
        updated_at = NOW()
        where id = $2`,
        [content, messageId]
      );
      return {
        message: 'Message updated',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async sendPersonalMessage(
    content: string,
    userId: string,
    image_url: string = '',
    image_asset_id: string = '',
    recipientId: string
  ) {
    try {
      await this.db.pool.query(`BEGIN`);

      const conversationExistsQuery = `
        SELECT id
        FROM conversations
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`;

      const { rows } = await this.db.pool.query(conversationExistsQuery, [
        userId,
        recipientId,
      ]);

      let conversationId = '';

      if (rows.length > 0) {
        conversationId = rows[0].id;
      } else {
        const {
          rows: [conversation],
        } = await this.db.pool.query(
          `INSERT INTO conversations (sender_id, recipient_id)
           VALUES ($1, $2)
           RETURNING id`,
          [userId, recipientId]
        );

        conversationId = conversation.id;
      }

      const {
        rows: [message],
      } = await this.db.pool.query(
        `INSERT INTO messages("content", user_id, "type", image_url, image_asset_id)
         VALUES ($1, $2, 'personal', $3, $4)
         RETURNING id`,
        [content, userId, image_url, image_asset_id]
      );

      await this.db.pool.query(
        `INSERT INTO personal_messages(conversation_id, message_id)
         VALUES ($1, $2)`,
        [conversationId, message.id]
      );

      await this.db.pool.query(`COMMIT`);
    } catch (error) {
      await this.db.pool.query(`ROLLBACK`);
      throw error;
    }
  }

  async fetchReplies(messageId: string, messages: any[]) {
    const replies = await this.db.pool.query(
      `SELECT
          mr.parent_message_id as parent_message_id,
          mr.id as reply_id,
          mr.author as author_id,
          m."content" as message,
          m.id as message_id,
          m.is_read as is_read,
          m.user_id as author,
          m.image_url as media_image,
          m."type" as message_type,
          m.image_asset_id as media_image_asset_id,
          m.created_at as created_at,
          m.updated_at as update_at,
          u.username as username
          FROM messages_replies as mr 
          JOIN messages as m ON m.id = mr.message_id
          JOIN users as u on u.id = m.user_id 
          WHERE mr.parent_message_id = $1 
          ORDER BY m.created_at ASC`,
      [messageId]
    );

    for await (const reply of replies.rows) {
      const replyReactions = await this.getReactions(reply.message_id);
      reply.reactions = replyReactions;
      messages.push(reply);
      await this.fetchReplies(reply.message_id, messages);
    }
  }

  async getPersonalMessage(
    conversationId: string | null,
    userId: string | null
  ) {
    try {
      const messages = [];

      const baseMessages = await this.db.pool.query(
        `SELECT 
        m.content AS message,
        m.is_read AS is_read,
        m.user_id AS author,
        m.id as message_id,
        m.image_url AS media_image,
        m.type AS message_type,
        m.image_asset_id AS media_image_asset_id,
        m.created_at AS created_at,
        m.updated_at AS update_at,
        pm.conversation_id AS conversationId,
        u.username AS username
        FROM personal_messages AS pm
        JOIN messages AS m ON m.id = pm.message_id
        JOIN users AS u ON u.id = m.user_id
        WHERE pm.conversation_id = COALESCE($1, pm.conversation_id)
        OR m.user_id = COALESCE($2, m.user_id)`,
        [conversationId, userId]
      );

      for await (const message of baseMessages.rows) {
        const reactions = await this.getReactions(message.message_id);
        message.reactions = reactions;
        messages.push(message);
        await this.fetchReplies(message.message_id, messages);
      }

      messages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const groupedMessages = groupReactionsByEmoji(messages);
      const allMessages = this.addLabelsToMessages(groupedMessages);
      return allMessages;
    } catch (error) {
      throw error;
    }
  }
}
