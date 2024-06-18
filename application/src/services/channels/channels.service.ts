import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChannelsService {
  constructor(private db: DatabaseService) { }

  private groupChannel(channels: any[]) {
    const grouped = channels.reduce((acc, channel) => {
      const existingCategory = acc.find(
        (cat) => cat.channel_type === channel.channel_type
      );
      if (existingCategory) {
        existingCategory.channels.push(channel);
      } else {
        acc.push({
          ...channel,
          channels: [channel],
        });
      }
      return acc;
    }, []);

    return grouped.sort((a, b) =>
      a.channel_type === 'text' ? -1 : b.channel_type === 'text' ? 1 : 0
    );
  }

  async isAllowedToManageChannel(serverId: string, userId: string) {
    const isallowed = await this.db.pool.query(
      `SELECT p.manage_channel
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        JOIN members m ON ur.user_id = m.user_id
        WHERE m.user_id = $1
        AND m.server_id = $2
        AND p.manage_channel = true`,
      [serverId, userId]
    );
    return isallowed.rows;
  }

  async getChannelById(id: string) {
    try {
      const channel = await this.db.pool.query(
        `select * from channels as c
          left join channel_messages as cm on cm.channel_id = c.id 
          left join messages as m on m.id = cm.message_id 
          left join channel_pinned_messages as cpm on cpm.channel_id  = c.id
          where c.id = $1`,
        [id]
      );

      if (channel.rows.length < 1) {
        return new NotFoundException('Channel not found', {
          description: `Channel with id ${id} is not found`,
        });
      } else {
        return {
          data: {
            channel: channel.rows,
          },
          error: false,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async createChannel(
    name: string,
    server_id: string,
    type: string,
    userId: string,
    serverAuthor: string
  ) {
    try {
      const isallowed = await this.isAllowedToManageChannel(server_id, userId);

      if (isallowed.length < 1 && userId !== serverAuthor) {
        throw new HttpException(
          'You are not allowed to create channel',
          HttpStatus.FORBIDDEN
        );
      }

      await this.db.pool.query(`begin`);
      const {
        rows: [channel],
      } = await this.db.pool.query(
        `INSERT INTO channels(name, server_id,type)
         VALUES($1, $2, $3)
         RETURNING id`,
        [name, server_id, type]
      );

      const {
        rows: [category1],
      } = await this.db.pool.query(
        `
          insert into categories (name, server_id)
          values($1, $2)
          returning id`,
        [type, server_id]
      );

      await this.db.pool.query(
        `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
        [channel.id, category1.id]
      );

      await this.db.pool.query(`commit`);

      return {
        message: 'Channel created',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateChannel(
    serverId: string,
    channelId: string,
    userId: string,
    serverAuthor: string,
    name: string,
    topic: string = '') {

    try {
      const isAllowedToUpdateChannel = await this.isAllowedToManageChannel(serverId, userId)

      if (isAllowedToUpdateChannel.length < 1 && userId !== serverAuthor) {
        throw new HttpException(
          'You are not allowed to update channel',
          HttpStatus.FORBIDDEN
        );
      }

      const isChannelExists = await this.db.pool.query('SELECT EXISTS(select * from channels where id = $1 and server_id = $2)', [channelId, serverId])

      if (!isChannelExists.rows[0].exists) {
        throw new NotFoundException("Channel doesnt exists")
      }

      await this.db.pool.query(`update channels 
        set name =  $1,
         topic = $2 
          where id = $3`, [name, topic, channelId])

      return {
        message: 'Channel updated',
        error: false
      }

    } catch (e) {
      throw e

    }

  }



  async getAllChannelsInServer(serverId: string) {
    try {
      const channelsQuery = await this.db.pool.query(
        `SELECT 
          c.id AS channel_id,
          c.name AS channel_name,
          c.type AS channel_type,
          cat.id AS category_id,
          c.topic as topic,
          cat.name AS category_name
          FROM channels c
          JOIN channels_category cc ON c.id = cc.channel_id
          JOIN categories cat ON cc.category_id = cat.id
          WHERE c.server_id = $1
          GROUP BY cat.id, c.id
          order by cat.name asc`,
        [serverId]
      );

      const categories = this.groupChannel(channelsQuery.rows);

      return {
        data: categories,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
