import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { z } from 'zod';

import { ValidationService } from '../validation/validation.service';
import { DatabaseService } from '../database/database.service';

const schema = z.object({
  name: z
    .string()
    .min(4, 'Min character is 4')
    .max(30, 'Max character for server name is 30'),
  logo: z.string().min(10),
  owner_id: z.string().min(10),
  logo_asset_id: z.string().min(10),
});

@Injectable()
export class ServersService {
  constructor(
    private validationService: ValidationService,
    private databaseService: DatabaseService
  ) {}

  async createServer(
    name: string,
    logo: string,
    owner_id: string,
    logo_asset_id: string
  ) {
    try {
      const {
        logo: serverLogo,
        logo_asset_id: assetId,
        name: serverName,
        owner_id: authorId,
      } = this.validationService.validate(schema, {
        logo,
        logo_asset_id,
        name,
        owner_id,
      });

      const author = await this.databaseService.pool.query(
        `select * from users where id = $1`,
        [authorId]
      );

      await this.databaseService.pool.query('BEGIN');

      try {
        const {
          rows: [server],
        } = await this.databaseService.pool.query(
          `insert into servers (name, logo, logo_asset_id, owner_id)
         VALUES($1, $2, $3, $4)
         RETURNING id`,
          [serverName, serverLogo, assetId, authorId]
        );

        const serverId = server.id;
        await this.databaseService.pool.query(
          `insert into server_profile(server_id, user_id, avatar, username)
          values($1, $2, $3, $4)`,
          [
            serverId,
            author.rows[0].id,
            author.rows[0].image,
            author.rows[0].username,
          ]
        );
        const {
          rows: [channel],
        } = await this.databaseService.pool.query(
          `insert into channels (server_id, "name", "type")
          values($1, 'general', 'text')
          returning id`,
          [serverId]
        );
        const channelId = channel.id;
        const {
          rows: [category1],
        } = await this.databaseService.pool.query(
          `
          insert into categories (name, server_id)
          values('text', $1)
          returning id`,
          [serverId]
        );

        await this.databaseService.pool.query(
          `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
          [channelId, category1.id]
        );

        const {
          rows: [audioChannel],
        } = await this.databaseService.pool.query(
          `insert into channels (server_id, type, name)
        VALUES($1, 'audio', 'general')
         RETURNING id`,
          [serverId]
        );

        const {
          rows: [category2],
        } = await this.databaseService.pool.query(
          `
          insert into categories (name, server_id)
          values('voice', $1)
          returning id`,
          [serverId]
        );

        await this.databaseService.pool.query(
          `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
          [audioChannel.id, category2.id]
        );
        await this.databaseService.pool.query(
          `insert into server_settings (server_id)
            values($1)`,
          [serverId]
        );

        await this.databaseService.pool.query('COMMIT');
      } catch (e) {
        await this.databaseService.pool.query('ROLLBACK');
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
        `select name, logo, created_at, updated_at, id, logo_asset_id, invite_code, banner, banner_asset_id, owner_id from servers
        where servers.owner_id = $1
        union all
        select name, logo, created_at, updated_at, servers.id, logo_asset_id, invite_code, banner, banner_asset_id,owner_id
         from servers
        join members as m on m.user_id = $1 
        where m.user_id = $1 and m.server_id = servers.id
        order by created_at asc
        `,
        [ownerId]
      );

      for (const server of servers.rows) {
        const serverProfile = await this.getServerProfile(
          server.id,
          server.owner_id
        );

        const serverSettings = await this.databaseService.pool.query(
          `select * from server_settings where server_id = $1`,
          [server.id]
        );
        server.settings = serverSettings.rows[0];
        server.serverProfile = serverProfile.data;
      }
      return {
        data: servers.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

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

  async getServerById(id: string) {
    try {
      const server = await this.databaseService.pool.query(
        `select * from servers where id = $1`,
        [id]
      );

      if (server.rows.length < 1) {
        throw new NotFoundException('Server not found', {
          description: `Server with ID : ${id} not found`,
        });
      }
      const channelsQuery = await this.databaseService.pool.query(
        `SELECT 
          c.id AS channel_id,
          c.name AS channel_name,
          c.type AS channel_type,
          cat.id AS category_id,
          cat.name AS category_name
          FROM channels c
          JOIN channels_category cc ON c.id = cc.channel_id
          JOIN categories cat ON cc.category_id = cat.id
          WHERE c.server_id = $1
          GROUP BY cat.id, c.id
          order by cat.name asc`,
        [id]
      );

      const channels = this.groupChannel(channelsQuery.rows);
      const serverSettings = await this.databaseService.pool.query(
        `select * from server_settings where server_id=$1`,
        [server.rows[0].id]
      );
      server.rows[0].settings = serverSettings.rows[0];

      return {
        data: {
          channels: channels,
          server: server.rows,
        },
        error: false,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async updateServerCode(serverId: string) {
    try {
      const res = await this.databaseService.pool.query(
        `
      update servers 
      set invite_code = uuid_generate_v4()
      where id = $1`,
        [serverId]
      );
      return {
        data: res[0],
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async inviteUser(inviteCode: string, userId: string, server_id: string) {
    try {
      if (!userId || !server_id || !inviteCode)
        throw new HttpException(
          'User id or server id or invite code is missing',
          HttpStatus.BAD_REQUEST
        );

      const isServerExists = await this.databaseService.pool.query(
        `SELECT * FROM servers WHERE invite_code = $1`,
        [inviteCode]
      );

      if (isServerExists.rows.length < 1) {
        throw new HttpException(
          'Invite code is not valid anymore',
          HttpStatus.BAD_REQUEST
        );
      }

      if (isServerExists.rows[0]?.owner_id === userId) {
        throw new HttpException(
          'You already an admin of this server',
          HttpStatus.BAD_REQUEST
        );
      }

      const banned_members = await this.databaseService.pool.query(
        `SELECT * 
       FROM banned_members AS bm
       JOIN server_profile AS sp ON sp.user_id = bm.member_id 
       WHERE bm.server_id = $1 AND sp.server_id = $1 and bm.member_id = $2`,
        [server_id, userId]
      );
      if (banned_members.rows.length >= 1) {
        throw new HttpException(
          'You are banned from this server, ask the author to remove you from banned list to join again',
          HttpStatus.FORBIDDEN
        );
      }

      const isUserMember = await this.databaseService.pool.query(
        `SELECT * FROM members AS m WHERE m.user_id = $1 AND m.server_id = $2`,
        [userId, server_id]
      );

      if (isUserMember.rows.length >= 1) {
        throw new HttpException(
          'You already a member of this server',
          HttpStatus.BAD_REQUEST
        );
      }
      const user = await this.databaseService.pool.query(
        `select * from users where id = $1`,
        [userId]
      );
      const isServerProfileExists = await this.databaseService.pool.query(
        `select * from server_profile where user_id = $1 and server_id = $2`,
        [userId, server_id]
      );
      await this.databaseService.pool.query('begin');

      await this.databaseService.pool.query(
        `INSERT INTO members(server_id, user_id) VALUES($1, $2)
        returning id`,
        [server_id, userId]
      );
      if (isServerProfileExists.rows.length < 1) {
        await this.databaseService.pool.query(
          `insert into server_profile(server_id, user_id, avatar, username)
          values($1, $2, $3, $4)`,
          [
            server_id,
            user.rows[0].id,
            user.rows[0].image,
            user.rows[0].username,
          ]
        );
      }

      await this.databaseService.pool.query('commit');
      return {
        message: 'Successfully join the server',
        error: false,
      };
    } catch (error) {
      console.log(error);

      await this.databaseService.pool.query('rollback');
      throw error;
    }
  }

  async deleteServer(serverId: string, currentSessionId: string) {
    try {
      const server = await this.databaseService.pool.query(
        `select * from servers where id = $1`,
        [serverId]
      );
      if (server.rows.length < 1) {
        throw new NotFoundException('Server not found');
      }

      if (currentSessionId !== server.rows[0].owner_id) {
        throw new HttpException(
          'You are not allowed to delete this server',
          HttpStatus.UNAUTHORIZED
        );
      }

      await this.databaseService.pool.query(`begin`);
      await this.databaseService.pool.query(
        `delete from servers where id = $1`,
        [serverId]
      );
      await this.databaseService.pool.query(
        `delete from members where members.server_id = $1`,
        [serverId]
      );

      await this.databaseService.pool.query(`commit`);

      return {
        message: 'Server has been deleted',
        error: false,
      };
    } catch (error) {
      await this.databaseService.pool.query(`rollback`);
      throw error;
    }
  }

  async updateServer(
    serverId: string,
    currentSessionId: string,
    name: string,
    logo: string,
    logo_asset_id: string,
    banner: string,
    bannerAssetId: string,
    showProgressBar: boolean,
    showBanner: boolean
  ) {
    try {
      const { rows } = await this.databaseService.pool.query(
        `select * from servers where id = $1`,
        [serverId]
      );

      if (rows.length < 1) {
        throw new NotFoundException('Server not found');
      }

      if (rows[0].owner_id !== currentSessionId) {
        throw new HttpException(
          'You are not allowed to update this server',
          HttpStatus.FORBIDDEN
        );
      }
      await this.databaseService.pool.query(
        `UPDATE servers
        SET name = $1,
       logo = $2,
       logo_asset_id = $3,
       banner = $4,
       banner_asset_id= $5
       WHERE id = $6`,
        [name, logo, logo_asset_id, banner, bannerAssetId, rows[0].id]
      );
      await this.databaseService.pool.query(
        `
      update server_settings 
      set show_progress_bar = $1,
       show_banner_background = $2
      where server_id = $3
      `,
        [showProgressBar, showBanner, serverId]
      );

      return {
        message: 'Server updated',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getServerProfile(serverId: string, userId: string) {
    try {
      const serverProfile = await this.databaseService.pool.query(
        `select * from server_profile as sp
          where sp.server_id = $1 AND sp.user_id = $2`,
        [serverId, userId]
      );
      return {
        data: serverProfile.rows[0],
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateServerprofile(
    serverId: string,
    userId: string,
    username: string,
    avatar: string,
    avatarAssetId: string,
    bio: string
  ) {
    try {
      const serverProfile = await this.databaseService.pool.query(
        `select * from server_profile as sp
          where sp.server_id = $1 AND sp.user_id = $2`,
        [serverId, userId]
      );

      if (serverProfile.rows.length < 1) {
        throw new NotFoundException('Server profile not found');
      }
      await this.databaseService.pool.query(
        `
        UPDATE server_profile AS sp
SET 
  username = $1,
  avatar = $2,
  avatar_asset_id = $3,
  bio = $4
WHERE 
  sp.server_id = $5 
  AND sp.user_id = $6;

      `,
        [username, avatar, avatarAssetId, bio, serverId, userId]
      );

      return {
        message: 'Server profile updated',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
