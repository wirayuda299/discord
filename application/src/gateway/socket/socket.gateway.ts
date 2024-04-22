import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/services/messages/messages.service';
import { ThreadsService } from 'src/services/threads/threads.service';

type PayloadTypes = {
  content: string;
  is_read: boolean;
  user_id: string;
  username: string;
  channel_id: string;
  server_id: string;
  imageUrl: string;
  imageAssetId: string;
  type: string;
  messageId: string;
  parentMessageId: string;
  threadId?: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private messages: MessagesService,
    private threadService: ThreadsService,
  ) {}

  private activeUsers = new Map<string, string>();

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
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: PayloadTypes,
  ) {
    if (payload.type === 'channel') {
      await this.messages.sendMessage({
        channel_id: payload.channel_id,
        content: payload.content,
        imageAssetId: payload.imageAssetId,
        imageUrl: payload.imageUrl,
        user_id: payload.user_id,
        is_read: payload.is_read,
        username: payload.username,
      });
    }

    if (payload.type === 'reply') {
      await this.messages.replyMessage(
        payload.parentMessageId,
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.channel_id,
      );
    }
    if (payload.type === 'thread') {
      await this.threadService.sendThreadMessage(
        payload.content,
        payload.user_id,
        payload.imageUrl,
        payload.imageAssetId,
        payload.threadId,
      );
    }
    if (payload.type !== 'thread') {
      const messages = await this.messages.getMessageByChannelId(
        payload.channel_id,
        payload.server_id,
      );
      client.emit('set-message', messages.data);
    } else {
      const messages = await this.threadService.getThreadMessage(
        payload.threadId,
        payload.server_id,
      );
      client.emit('set-thread-messages', messages);
    }
  }

  @SubscribeMessage('get-channel-message')
  async getChannelMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string; serverId: string },
  ) {
    const messages = await this.messages.getMessageByChannelId(
      payload.channelId,
      payload.serverId,
    );

    client.emit('set-message', messages.data);
  }

  @SubscribeMessage('thread-messages')
  async handleThread(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      threadId: string;
      serverId: string;
    },
  ) {
    const messages = await this.threadService.getThreadMessage(
      payload.threadId,
      payload.serverId,
    );
    client.emit('set-thread-messages', messages);
  }
}
