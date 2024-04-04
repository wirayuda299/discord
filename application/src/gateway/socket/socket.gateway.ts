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

  private userConnections = new Map<string, string>();

  onModuleInit() {
    console.log(process.env.ORIGIN);

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
      this.userConnections.set(userId as string, userId as string);
      this.broadcastActiveUsers();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.userConnections.delete(userId as string);
      this.broadcastActiveUsers();
    }
  }

  private broadcastActiveUsers() {
    this.server.emit(
      'set-active-users',
      Array.from(this.userConnections.keys()),
    );
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      channel_id: string;
      message_id: string;
      id: string;
      content: string;
      is_read: boolean;
      user_id: string;
      image_url: string | null;
      image_asset_id: string | null;
      created_at: string;
      updated_at: string;
      username: string;
      email: string;
      image: string;
    },
  ) {
    client.emit('set-message', { msg: payload });
    this.messages.sendMessage(payload);
  }
  @SubscribeMessage('messages-channel')
  async loadMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string },
  ) {
    const msg = await this.messages.loadMessages(payload.channelId);
    client.emit('messages-loaded', msg);
  }
}
