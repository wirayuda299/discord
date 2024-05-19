import { Logger, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  private logger = new Logger();

  @WebSocketServer()
  server: Server;

  constructor(
    private messages: MessagesService,
    private threadService: ThreadsService,
    private roles: RolesService
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    this.server.on('disconnect', (socket) => {
      this.handleDisconnect(socket);
    });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.activeUsers.set(userId as string, userId as string);
      this.broadcastActiveUsers();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.activeUsers.delete(userId as string);
      this.broadcastActiveUsers();
    }
  }

  private broadcastActiveUsers() {
    this.server.emit('set-active-users', Array.from(this.activeUsers.keys()));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    payload: PayloadTypes
  ) {
    this.logger.log(payload);
    if (payload.type === 'channel') {
      await this.messages.sendMessage({
        channelId: payload.channelId,
        content: payload.content,
        imageAssetId: payload.imageAssetId,
        imageUrl: payload.imageUrl,
        user_id: payload.user_id,
        is_read: payload.is_read,
        username: payload.username,
      });

      const messages = await this.messages.getMessageByChannelId(
        payload.channelId,
        payload.serverId
      );

      this.server.emit('set-message', messages.data);
    }

    if (payload.type === 'reply') {
      await this.messages.replyMessage(
        payload.parentMessageId,
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.type
      );

      if (payload.threadId) {
        const messages = await this.threadService.getThreadMessage(
          payload.threadId,
          payload.serverId,
          payload.channelId
        );
        this.server.emit('set-thread-messages', messages);
      }

      if (payload.recipientId) {
        const messages = await this.messages.getPersonalMessage(
          payload.conversationId,
          payload.user_id
        );
        this.server.emit('set-personal-messages', messages);
      }

      if (payload.channelId && payload.serverId) {
        const messages = await this.messages.getMessageByChannelId(
          payload.channelId,
          payload.serverId
        );

        this.server.emit('set-message', messages.data);
      }
    }
    if (payload.type === 'thread') {
      await this.threadService.sendThreadMessage(
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.threadId
      );
      const messages = await this.threadService.getThreadMessage(
        payload.threadId,
        payload.serverId,
        payload.channelId
      );
      this.server.emit('set-thread-messages', messages);
    }

    if (payload.type === 'personal') {
      await this.messages.sendPersonalMessage(
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.recipientId
      );

      const messages = await this.messages.getPersonalMessage(
        payload.conversationId,
        payload.user_id
      );
      this.server.emit('set-personal-messages', messages);
    }
  }

  @SubscribeMessage('get-channel-message')
  async getChannelMessage(
    @MessageBody() payload: { channelId: string; serverId: string }
  ) {
    const messages = await this.messages.getMessageByChannelId(
      payload.channelId,
      payload.serverId
    );

    this.server.emit('set-message', messages.data);
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
    const messages = await this.threadService.getThreadMessage(
      payload.threadId,
      payload.serverId,
      payload.channelId
    );
    this.server.emit('set-thread-messages', messages);
  }

  @SubscribeMessage('personal-message')
  async getPersonalMessages(
    @MessageBody()
    payload: {
      conversationId: string;
      userId: string;
    }
  ) {
    const messages = await this.messages.getPersonalMessage(
      payload.conversationId,
      payload.userId
    );
    this.server.emit('set-personal-messages', messages);
  }

  @SubscribeMessage('member-roles')
  async getMemberRole(
    @MessageBody() payload: { userId: string; serverId: string }
  ) {
    const role = await this.roles.getCurrentUserRole(
      payload.userId,
      payload.serverId
    );
    this.server.emit('set-current-user-role', role);
  }
}
