import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChannelsService {
  constructor(private db: DatabaseService) {}

  async getChannelById(id: string) {
    try {
      const channel = await this.db.pool.query(
        `select * from channels as c
left join channel_messages as cm on cm.channel_id = c.id 
left join messages as m on m.id = cm.message_id 
left join channel_pinned_messages as cpm on cpm.channel_id  = c.id

where c.id = $1`,
        [id],
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

  async createChannel(name: string, server_id: string, type: string) {
    try {
      await this.db.pool.query(`begin`);
      const {
        rows: [channel],
      } = await this.db.pool.query(
        `INSERT INTO channels(name, server_id,type)
         VALUES($1, $2, $3)
         RETURNING id`,
        [name, server_id, type],
      );

      const {
        rows: [category1],
      } = await this.db.pool.query(
        `
          insert into categories (name, server_id)
          values($1, $2)
          returning id`,
        [type, server_id],
      );

      await this.db.pool.query(
        `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
        [channel.id, category1.id],
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
}
