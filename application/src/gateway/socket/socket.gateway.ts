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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private messages: MessagesService) {}

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
    payload: {
      content: string;
      is_read: boolean;
      user_id: string;
      created_at: string;
      username: string;
      channel_id: string;
      server_id: string;
      image_url?: string;
      image_asset_id?: string;
      type: string;
      messageId: string;
    },
  ) {
    if (payload.type === 'common') {
      await this.messages.sendMessage(payload);
    } else {
      await this.messages.replyMessage(
        payload.messageId,
        payload.content,
        payload.user_id,
      );
    }
    const messages = await this.messages.getMessageByChannelId(
      payload.channel_id,
      payload.server_id,
    );
    client.emit('set-message', messages.data);
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
}
