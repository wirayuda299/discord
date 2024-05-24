import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { ServersService } from '../servers/servers.service';
import { ImagehandlerService } from '../imagehandler/imagehandler.service';

@Injectable()
export class MembersService {
  constructor(
    private db: DatabaseService,
    private serverService: ServersService,
    private imageService: ImagehandlerService
  ) {}

  async isAllowedToKickMember(serverId: string, userId: string) {
    const isallowed = await this.db.pool.query(
      `SELECT p.manage_channel
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        JOIN members m ON ur.user_id = m.user_id
        WHERE m.user_id = $1
        AND m.server_id = $2
        AND p.kick_member = true`,
      [serverId, userId]
    );
    return isallowed.rows;
  }

  async isMemberOrServerAuthor(userId: string, serverId: string) {
    try {
      const member = await this.db.pool.query(
        `
          select * from members as m
           where m.user_id = $1 
          and m.server_id = $2
          `,
        [userId, serverId]
      );
      const author = await this.db.pool.query(
        `select * from servers as s
          where s.owner_id = $1 and s.id = $2`,
        [userId, serverId]
      );

      return {
        data: {
          isMember: member.rows.length >= 1,
          isAuthor: author.rows.length >= 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getMemberInServer(serverId: string) {
    try {
      const members = await this.db.pool.query(
        ` select * from members as m
          join server_profile as sp on sp.user_id = m.user_id 
          and sp.server_id = $1 
          where m.server_id = $1`,
        [serverId]
      );

      for await (const member of members.rows) {
        const role = await this.db.pool.query(
          `select * from role_permissions as rp
          join roles as r on r.id = rp.role_id 
          join permissions as p on p.id = rp.permission_id 
          join user_roles as ur on ur.role_id = r.id 
          where ur.user_id = $1 and r.server_id = $2`,
          [member.user_id, serverId]
        );
        const serverProfile = await this.serverService.getServerProfile(
          serverId,
          member.user_id
        );

        member.role = role.rows[0];
        member.serverProfile = serverProfile.data;
      }

      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMembersFromSpesificRole(serverId: string, roleName: string) {
    try {
      const members = await this.db.pool.query(
        ` SELECT *
          FROM members m
          JOIN user_roles ur ON m.user_id = ur.user_id
          JOIN roles r ON ur.role_id = r.id
          join server_profile as sp on sp.server_id = $1 and sp.user_id = ur.user_id
          WHERE m.server_id = $1 AND r.name = $2`,
        [serverId, roleName]
      );

      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMembersHasNoRole(serverId: string) {
    try {
      const members = await this.db.pool.query(
        ` SELECT *
        FROM members m
        LEFT JOIN user_roles ur ON m.user_id = ur.user_id
        join server_profile as sp on sp.server_id = $1 and sp.user_id = ur.user_id
          WHERE ur.role_id IS NULL
          AND m.server_id = $1`,
        [serverId]
      );
      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async kickMember(
    serverId: string,
    memberId: string,
    serverAuthor: string,
    currentUser: string
  ) {
    try {
      console.log({ serverId, memberId, serverAuthor, currentUser });

      const isAllowed = await this.isAllowedToKickMember(serverId, memberId);
      if (isAllowed.length < 1 && serverAuthor !== currentUser) {
        throw new HttpException(
          'You are not allowed to kick member',
          HttpStatus.FORBIDDEN
        );
      }

      const foundMember = await this.db.pool.query(
        `select * from members where server_id = $1 and user_id = $2`,
        [serverId, memberId]
      );

      const serverProfile = await this.serverService.getServerProfile(
        serverId,
        memberId
      );
      const roles = await this.db.pool.query(
        ` select * from user_roles as ur
          join roles as r on r.id = ur.role_id 
          join permissions as p on p.id = ur.permission_id 
          where ur.user_id = $1 and p.server_id = $2`,
        [memberId, serverId]
      );

      const serverProfileAssetId = serverProfile.data?.avatar_asset_id;
      await this.db.pool.query(`begin`);

      if (serverProfileAssetId) {
        await this.imageService.deleteImage(serverProfileAssetId);
      }

      if (foundMember.rows.length < 1) {
        throw new NotFoundException('Member not found');
      }

      await this.db.pool.query(
        `delete from members where user_id = $1 and server_id = $2`,
        [memberId, serverId]
      );

      if (roles.rows.length >= 1) {
        await this.db.pool.query(
          `DELETE FROM user_roles
            WHERE user_id = $1
            AND role_id IN (
                SELECT id FROM roles
                WHERE server_id =$2
            )`,
          [memberId, serverId]
        );
      }

      await this.db.pool.query(
        `delete from server_profile as sp where sp.server_id = $1 and sp.user_id = $2`,
        [serverId, memberId]
      );
      await this.db.pool.query(`commit`);
      return {
        messages: 'Member kicked from server',
        error: false,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async banMember(serverId: string, memberId: string, bannedBy: string) {
    try {
      await this.db.pool.query(
        `insert into banned_members(server_id, member_id, banned_by)
        values($1, $2, $3)`,
        [serverId, memberId, bannedBy]
      );
      return {
        message: 'Member banned',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async revokeBannedMember(serverId: string, memberId: string) {
    try {
      await this.db.pool.query(
        `delete from banned_members as bm where bm.server_id= $1 and bm.member_id = $2 `,
        [serverId, memberId]
      );
      return {
        message: 'Member removed from banned member list',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getBannedMembers(serverId: string) {
    try {
      const bannedMembers = await this.db.pool.query(
        `SELECT * 
       FROM banned_members AS bm
       JOIN users AS u ON u.id = bm.member_id 
       WHERE bm.server_id = $1 AND bm.server_id = $1`,
        [serverId]
      );
      return bannedMembers.rows;
    } catch (error) {
      throw error;
    }
  }
}
