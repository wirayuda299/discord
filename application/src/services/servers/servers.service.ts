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
  name: z.string().min(3),
  logo: z.string().min(10),
  owner_id: z.string().min(10),
  logo_asset_id: z.string().min(10),
});

@Injectable()
export class ServersService {
  constructor(
    private validationService: ValidationService,
    private databaseService: DatabaseService,
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

      const author = await this.databaseService.pool.query(
        `select * from users where id = $1`,
        [owner_id],
      );
      this.validationService.validate(schema, data);

      const existingChannel = await this.databaseService.pool.query(
        `SELECT * FROM servers WHERE name = $1`,
        [name],
      );

      if (existingChannel.rows.length >= 1) {
        throw new HttpException(
          'Server name already exists, please choose another name',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.databaseService.pool.query('BEGIN');

      try {
        const {
          rows: [server],
        } = await this.databaseService.pool.query(
          `insert into servers (name, logo, logo_asset_id, owner_id)
         VALUES($1, $2, $3, $4)
         RETURNING id`,
          [name, logo, logo_asset_id, owner_id],
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
          ],
        );
        const {
          rows: [channel],
        } = await this.databaseService.pool.query(
          `insert into channels (server_id, "name", "type")
          values($1, 'general', 'text')
          returning id`,
          [serverId],
        );
        const channelId = channel.id;
        const {
          rows: [category1],
        } = await this.databaseService.pool.query(
          `
          insert into categories (name, server_id)
          values('text', $1)
          returning id`,
          [serverId],
        );

        await this.databaseService.pool.query(
          `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
          [channelId, category1.id],
        );

        const {
          rows: [audioChannel],
        } = await this.databaseService.pool.query(
          `insert into channels (server_id, type, name)
        VALUES($1, 'audio', 'general')
         RETURNING id`,
          [serverId],
        );

        const {
          rows: [category2],
        } = await this.databaseService.pool.query(
          `
          insert into categories (name, server_id)
          values('voice', $1)
          returning id`,
          [serverId],
        );

        await this.databaseService.pool.query(
          `insert into channels_category (channel_id, category_id)
            values($1, $2)`,
          [audioChannel.id, category2.id],
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
        `select name, logo, created_at, updated_at, id, logo_asset_id from servers
        where servers.owner_id = $1
        union
        select name, logo, created_at, updated_at, servers.id, logo_asset_id from servers
        join members as m on m.user_id = servers.owner_id
        where m.user_id = $1
        order by created_at asc
        `,
        [ownerId],
      );

      for (const server of servers.rows) {
        const serverProfile = await this.databaseService.pool.query(
          `select * from server_profile where user_id = $1 and server_id = $2`,
          [ownerId, server.id],
        );
        server.serverProfile = serverProfile.rows[0];
      }

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
      const server = await this.databaseService.pool.query(
        `select * from servers where id = $1`,
        [id],
      );
      const channelsQuery = await this.databaseService.pool.query(
        `SELECT 
    c.id AS channel_id,
    c.name AS channel_name,
    c.type AS channel_type,
    cat.id AS category_id,
    cat.name AS category_name
FROM 
    channels c
JOIN 
    channels_category cc ON c.id = cc.channel_id
JOIN 
    categories cat ON cc.category_id = cat.id
WHERE 
    c.server_id = $1
GROUP BY 
    cat.id, c.id
    order by cat.name asc
    `,
        [id],
      );

      const channels = channelsQuery.rows;

      return {
        data: {
          channels,
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
        [serverId],
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
          'User or server id or invite code is missing',
          HttpStatus.BAD_REQUEST,
        );

      const isServerExists = await this.databaseService.pool.query(
        `SELECT * FROM servers WHERE servers.invite_code = $1`,
        [inviteCode],
      );

      if (isServerExists.rows.length < 1) {
        throw new HttpException(
          'Invite code is not valid anymore',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isServerExists.rows[0]?.owner_id === userId) {
        throw new HttpException(
          'You already an admin of this server',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isUserMember = await this.databaseService.pool.query(
        `SELECT * FROM members AS m WHERE m.user_id = $1 AND m.server_id = $2`,
        [userId, server_id],
      );

      if (isUserMember.rows.length >= 1) {
        throw new HttpException(
          'You already an admin of this server',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.databaseService.pool.query('BEGIN');

      const member = await this.databaseService.pool.query(
        `INSERT INTO members(server_id, user_id) VALUES($1, $2)
        returning id`,
        [server_id, userId],
      );

      const roles = await this.databaseService.pool.query(
        `INSERT INTO roles(name) VALUES('common') RETURNING id`,
      );
      await this.databaseService.pool.query(
        `INSERT INTO member_roles (member_id, role_id) VALUES($1, $2)`,
        [member.rows[0].id, roles.rows[0].id],
      );

      const permission = await this.databaseService.pool.query(
        `INSERT INTO permissions ("name") VALUES('common') RETURNING id`,
      );

      await this.databaseService.pool.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES($1, $2)`,
        [roles.rows[0].id, permission.rows[0].id],
      );

      await this.databaseService.pool.query('COMMIT');

      return {
        message: 'Successfully join the server',
        error: false,
      };
    } catch (error) {
      await this.databaseService.pool.query('ROLLBACK');
      throw error;
    }
  }

  async getMemberInServer(serverId: string) {
    try {
      const members = await this.databaseService.pool.query(
        `select * from servers as s
join members as m on m.server_id = s.id 
join member_roles as mr on mr.member_id = m.id  
join users as u on u.id = m.user_id 
join roles as r on r.id =mr.role_id 
join role_permissions as rp on rp.role_id = r.id  
 join permissions as p on p.id = rp.permission_id 
 join role_permissions as rp2 on rp2.permission_id = p.id 
where s.id = $1`,
        [serverId],
      );

      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteServer(serverId: string, currentSessionId: string) {
    try {
      const server = await this.databaseService.pool.query(
        `
      select * from servers where id = $1
      `,
        [serverId],
      );
      if (server.rows.length < 1) {
        throw new NotFoundException('Server not found');
      }

      if (currentSessionId !== server.rows[0].owner_id) {
        throw new HttpException(
          'You are not allowed to delete this server',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.databaseService.pool.query(`begin`);
      await this.databaseService.pool.query(
        `delete from servers where id = $1`,
        [serverId],
      );
      await this.databaseService.pool.query(
        `delete from members where members.server_id = $1`,
        [serverId],
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
  ) {
    try {
      const { rows } = await this.databaseService.pool.query(
        `select * from servers where id = $1`,
        [serverId],
      );

      if (rows.length < 1) {
        throw new NotFoundException('Server not found');
      }

      if (rows[0].owner_id !== currentSessionId) {
        throw new HttpException(
          'You are not allowed to update this server',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.databaseService.pool.query(
        `UPDATE servers
   SET name = $2,
       logo = $3,
       logo_asset_id = $4
   WHERE id = $1`,
        [rows[0].id, name, logo, logo_asset_id],
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
        [serverId, userId],
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
    bio: string,
  ) {
    try {
      const serverProfile = await this.databaseService.pool.query(
        `select * from server_profile as sp
          where sp.server_id = $1 AND sp.user_id = $2`,
        [serverId, userId],
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
        [username, avatar, avatarAssetId, bio, serverId, userId],
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
