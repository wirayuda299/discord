import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class InvitationService {
  constructor(private db: DatabaseService) {}

  async inviteUser(userToInvite: string, userId: string) {
    try {
      await this.db.pool.query(
        `insert into invitation (user_to_invite, invitator, status)
values($1, $2, 'pending')`,
        [userToInvite, userId],
      );

      return {
        data: 'Invitiation sended',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPendingInvitation(userId: string) {
    try {
      const pendingInvitation = await this.db.pool.query(
        `
     select * from invitation as i
join users as u on i.user_to_invite  = u.id 
where i.invitator = $1 and i.status = 'pending'
`,
        [userId],
      );

      return {
        data: pendingInvitation,
        error: false,
      };
    } catch (error) {}
  }

  async getCurrentUserInvitation(userId: string) {
    try {
      const pendingInvitation = await this.db.pool.query(
        `
     select * from invitation as i
join users as u on i.invitator  = u.id 
where i.user_to_invite = $1 and i.status = 'pending'
`,
        [userId],
      );
      return {
        data: pendingInvitation,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async acceptInvitation(userId: string, friend_id: string) {
    try {
      await this.db.pool.query(
        `
      begin;
      update invitation 
      set status = 'accepted'
      where invitation.user_to_invite = $1;

      insert into friends(friend_id, user_id)
      values($1, $1)

      commit;
      `,
        [friend_id, userId],
      );
      return {
        data: 'Now you are friend',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }
}
