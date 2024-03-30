import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { DatabaseService } from '../database/database.service';
import { ValidationService } from '../validation/validation.service';

const schema = z.object({
  name: z.string().min(3),
  logo: z.string().min(10),
  owner_id: z.string().min(10),
  logo_asset_id: z.string().min(10),
});

@Injectable()
export class ServersService {
  constructor(
    private databaseService: DatabaseService,
    private validationService: ValidationService,
  ) {}
  async createServer(
    name: string,
    logo: string,
    owner_id: string,
    logo_asset_id: string,
  ) {
    try {
      const data = {
        name,
        logo,
        owner_id,
        logo_asset_id,
      };

      this.validationService.validate(schema, data);

      const existingChannel = await this.databaseService.pool.query(
        `SELECT * FROM servers WHERE name = $1`,
        [name.toLowerCase()],
      );
      if (existingChannel.rows.length >= 1) {
        throw new HttpException(
          'Server name already exists, please choose another name',
          HttpStatus.BAD_REQUEST,
        );
      }

      try {
        await this.databaseService.pool.query(
          `
          do $$
            declare
              server_id uuid;
              text_channel uuid;
              audio_channel uuid;
            begin
              insert into servers(name, logo, logo_asset_id, owner_id)
              values('${name}', '${logo}', '${logo_asset_id}', '${owner_id}')
              returning id into server_id;

              insert into channels(name, server_id)
              values('general', server_id)
              returning id into text_channel;

              insert into channels_category(type, channel_id)
              values('text', text_channel);

              insert into channels(name, server_id)
              values('general', server_id)
              returning id into audio_channel;

              insert into channels_category(type, channel_id)
              values('audio', audio_channel);
              
              insert into server_channels (server_id, channel_id)
              values(server_id, text_channel);

              insert into server_channels (server_id, channel_id)
              values(server_id, audio_channel);

              end $$;`,
        );
      } catch (e) {
        throw e;
      }

      return {
        message: 'Server has been created',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllServerCreatedByCurrentUserOrAsMember(ownerId: string) {
    try {
      const servers = await this.databaseService.pool.query(
        `select name, logo, created_at, updated_at, id, logo_asset_id from servers
where servers.owner_id = $1
union
select name, logo, created_at, updated_at, id, logo_asset_id from servers
join server_members on servers.id = server_members.server_id
where server_members.user_id = $1`,
        [ownerId],
      );
      return {
        data: servers.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getServerById(id: string) {
    try {
      const channelsQuery = await this.databaseService.pool.query(
        `select servers.invite_code, servers.owner_id as user_id, servers.name as server_name, servers.id as server_id, servers.logo,
servers.created_at, c.id as channel_id, c.name as channel_name, cc.type
from servers 
join channels as c on c.server_id = servers.id 
join channels_category as cc on cc.channel_id = c.id 
where servers.id = '${id}'
`,
      );

      const channels = channelsQuery.rows;

      const groupedChannels = {
        audio: channels.filter((channel) => channel.type === 'audio'),
        text: channels.filter((channel) => channel.type === 'text'),
      };

      return {
        data: {
          server: {
            name: groupedChannels?.audio[0]?.server_name,
            logo: groupedChannels?.audio[0]?.logo,
            id: groupedChannels?.audio[0]?.server_id,
            invite_code: groupedChannels?.audio[0]?.invite_code,
          },
          channels: groupedChannels,
        },
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateServerCode(serverId: string) {
    try {
      const res = await this.databaseService.pool.query(`
      
      update servers 
set invite_code = uuid_generate_v4()
where id = '${serverId}'`);
      return {
        data: res.rows[0],
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async inviteUser(
    inviteCode: string,
    userId: string,
    server_id: string,
    channelId: string,
  ) {
    try {
      if (!inviteCode)
        throw new HttpException(
          'Invite code is missing',
          HttpStatus.BAD_REQUEST,
        );
      if (!userId)
        throw new HttpException('user id is missing', HttpStatus.BAD_REQUEST);
      if (!server_id)
        throw new HttpException('server id is missing', HttpStatus.BAD_REQUEST);

      const isServerExists = await this.databaseService.pool
        .query(`select * from servers 
where servers.invite_code = '${inviteCode}'`);
      if (isServerExists.rows.length < 1) {
        throw new HttpException(
          'Invite code is not valid anymore',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isServerExists.rows[0].owner_id === userId) {
        throw new HttpException(
          'You already an admin of this server',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isUserMember = await this.databaseService.pool
        .query(`select * from server_members as sm
where sm.user_id = '${userId}'`);

      if (isUserMember.rows.length >= 1) {
        throw new HttpException(
          'You already an admin of this server',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.databaseService.pool.query(`
      do $$
declare
role_id uuid;
begin
insert into server_members (server_id, user_id)
values('${server_id}', '${userId}');

insert into roles("name", server_id)
values('member', '${server_id}')
returning id into role_id;

insert into server_roles (server_id, channel_id, role_id)
values('${server_id}', '${channelId}', role_id);

end$$;`);
      return {
        message: 'Successfully join the server',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMemberInServer(serverId: string) {
    try {
      const members = await this.databaseService.pool.query(
        `select * from server_members as sm 
join users as u on sm.user_id = u.id 
join server_roles as sr on sr.server_id = sm.server_id 
join roles as r on r.id = sr.role_id 
where sm.server_id = '${serverId}'`,
      );

      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      console.error('Error in getMemberInServer:', error);
      throw error;
    }
  }
}
