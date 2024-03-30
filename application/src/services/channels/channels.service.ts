import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChannelsService {
  constructor(private databaseService: DatabaseService) {}
  async getChannelById(id: string) {
    try {
      const channel = await this.databaseService.pool.query(
        `select * from channels where id = '${id}'`,
      );

      const messages = await this.databaseService.pool
        .query(` select * from messages
where messages.channel_id = '${id}'
order by messages.created_at asc`);

      if (channel.rows.length < 1) {
        return new NotFoundException('Channel not found', {
          description: `Channel with id ${id} is not found`,
        });
      } else {
        return {
          data: {
            channel: channel.rows[0],
            messages: messages.rows,
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
      await this.databaseService.pool.query(`
      do $$
    declare
        channel_id uuid;
        begin 
        insert into channels(name, server_id)
values('${name}', '${server_id}')
returning id into channel_id;

insert into server_channels(server_id, channel_id)
values('${server_id}', channel_id);

  insert into channels_category(type, channel_id)
              values('${type}', channel_id);
    end $$;
      `);
      return {
        message: 'Channel created',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
