import { Logger, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MembersService } from 'src/services/members/members.service';
import { MessagesService } from 'src/services/messages/messages.service';
import { RolesService } from 'src/services/roles/roles.service';
import { ThreadsService } from 'src/services/threads/threads.service';

type PayloadTypes = {
  content: string;
  is_read: boolean;
  user_id: string;
  username: string;
  channelId: string;
  serverId: string;
  imageUrl: string;
  imageAssetId: string;
  type: string;
  messageId: string;
  parentMessageId: string;
  threadId: string;
  recipientId: string;
  isNew: boolean;
  conversationId: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnModuleInit {
  private activeUsers = new Map<string, string>();
  private logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private threadsService: ThreadsService,
    private rolesService: RolesService,
    private membersService: MembersService
  ) {}

  onModuleInit() {
    this.server.on('connection', this.handleConnection.bind(this));
    this.server.on('disconnect', this.handleDisconnect.bind(this));
  }

  private handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, userId);
      this.broadcastActiveUsers();
    }
  }

  private handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.delete(userId);
      this.broadcastActiveUsers();
    }
  }

  private broadcastActiveUsers() {
    this.server.emit('set-active-users', Array.from(this.activeUsers.keys()));
  }

  private async handleSendMessage(payload: PayloadTypes) {
    try {
      await this.messagesService.sendMessage({
        channelId: payload.channelId,
        content: payload.content,
        imageAssetId: payload.imageAssetId,
        imageUrl: payload.imageUrl,
        user_id: payload.user_id,
        is_read: payload.is_read,
        username: payload.username,
      });
      const messages = await this.messagesService.getMessageByChannelId(
        payload.channelId,
        payload.serverId
      );
      this.server.emit('set-message', messages.data);
    } catch (error) {
      this.logger.error('Error sending message', error);
    }
  }

  private async handleReplyMessage(payload: PayloadTypes) {
    try {
      await this.messagesService.replyMessage(
        payload.parentMessageId,
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.type
      );

      await this.updateMessagesBasedOnPayload(payload);
    } catch (error) {
      this.logger.error('Error replying to message', error);
    }
  }

  private async handleThreadMessage(payload: PayloadTypes) {
    try {
      await this.threadsService.sendThreadMessage(
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.threadId
      );
      const messages = await this.threadsService.getThreadMessage(
        payload.threadId,
        payload.serverId,
        payload.channelId
      );
      this.server.emit('set-thread-messages', messages);
    } catch (error) {
      this.logger.error('Error handling thread message', error);
    }
  }

  private async handlePersonalMessage(payload: PayloadTypes) {
    try {
      await this.messagesService.sendPersonalMessage(
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.recipientId
      );
      const messages = await this.messagesService.getPersonalMessage(
        payload.conversationId,
        payload.user_id
      );
      this.server.emit('set-personal-messages', messages);
    } catch (error) {
      this.logger.error('Error handling personal message', error);
    }
  }

  private async updateMessagesBasedOnPayload(payload: PayloadTypes) {
    try {
      if (payload.threadId) {
        const messages = await this.threadsService.getThreadMessage(
          payload.threadId,
          payload.serverId,
          payload.channelId
        );
        this.server.emit('set-thread-messages', messages);
      } else if (payload.recipientId) {
        const messages = await this.messagesService.getPersonalMessage(
          payload.conversationId,
          payload.user_id
        );
        this.server.emit('set-personal-messages', messages);
      } else if (payload.channelId && payload.serverId) {
        const messages = await this.messagesService.getMessageByChannelId(
          payload.channelId,
          payload.serverId
        );
        this.server.emit('set-message', messages.data);
      }
    } catch (error) {
      this.logger.error('Error updating messages based on payload', error);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: PayloadTypes) {
    this.logger.log(`Handling message of type: ${payload.type}`);
    switch (payload.type) {
      case 'channel':
        await this.handleSendMessage(payload);
        break;
      case 'reply':
        await this.handleReplyMessage(payload);
        break;
      case 'thread':
        await this.handleThreadMessage(payload);
        break;
      case 'personal':
        await this.handlePersonalMessage(payload);
        break;
      default:
        this.logger.warn(`Unknown message type: ${payload.type}`);
    }
  }

  @SubscribeMessage('get-channel-message')
  async getChannelMessage(
    @MessageBody() payload: { channelId: string; serverId: string }
  ) {
    try {
      const messages = await this.messagesService.getMessageByChannelId(
        payload.channelId,
        payload.serverId
      );
      this.server.emit('set-message', messages.data);
    } catch (error) {
      this.logger.error('Error getting channel messages', error);
    }
  }

  @SubscribeMessage('thread-messages')
  async handleThread(
    @MessageBody()
    payload: {
      threadId: string;
      serverId: string;
      channelId: string;
    }
  ) {
    try {
      const messages = await this.threadsService.getThreadMessage(
        payload.threadId,
        payload.serverId,
        payload.channelId
      );
      this.server.emit('set-thread-messages', messages);
    } catch (error) {
      this.logger.error('Error getting thread messages', error);
    }
  }

  @SubscribeMessage('personal-message')
  async getPersonalMessages(
    @MessageBody() payload: { conversationId: string; userId: string }
  ) {
    try {
      const messages = await this.messagesService.getPersonalMessage(
        payload.conversationId,
        payload.userId
      );
      this.server.emit('set-personal-messages', messages);
    } catch (error) {
      this.logger.error('Error getting personal messages', error);
    }
  }

  @SubscribeMessage('member-roles')
  async getMemberRole(
    @MessageBody() payload: { userId: string; serverId: string }
  ) {
    try {
      const role = await this.rolesService.getCurrentUserRole(
        payload.userId,
        payload.serverId
      );
      this.server.emit('set-current-user-role', role);
    } catch (error) {
      this.logger.error('Error getting member role', error);
    }
  }

  @SubscribeMessage('banned-members')
  async getBannedMembers(@MessageBody() payload: { serverId: string }) {
    try {
      const members = await this.membersService.getBannedMembers(
        payload.serverId
      );
      this.server.emit('set-banned-members', members);
    } catch (error) {
      this.logger.error('Error getting banned members', error);
    }
  }
}
