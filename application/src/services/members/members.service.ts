import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MembersService {
  constructor(private db: DatabaseService) {}

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
          `
        select * from role_permissions as rp
        join roles as r on r.id = rp.role_id 
        join permissions as p on p.id = rp.permission_id 
        join user_roles as ur on ur.role_id = r.id 
        where ur.user_id = $1 and r.server_id = $2
      `,
          [member.user_id, serverId]
        );
        member.role = role.rows[0];
      }
      return {
        data: members.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
