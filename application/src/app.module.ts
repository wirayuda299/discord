import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FriendsController } from './controllers/friends/friends.controller';
import { UserController } from './controllers/user/user.controller';

import { ChannelsController } from './controllers/channels/channels.controller';
import { FileUploadController } from './controllers/file-upload/file-upload.controller';
import { ServersController } from './controllers/servers/servers.controller';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { ValidationModule } from './modules/validation.module';
import { ChannelsService } from './services/channels/channels.service';
import { FriendsService } from './services/friends/friends.service';
import { ServersService } from './services/servers/servers.service';
import { UserService } from './services/user/user.service';
import { ValidationService } from './services/validation/validation.service';
import { MessagesService } from './services/messages/messages.service';
import { MessagesController } from './controllers/messages/messages.controller';
import { InvitationService } from './services/invitation/invitation.service';
import { InvitationController } from './controllers/invitation/invitation.controller';
import { DatabaseService } from './services/database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ValidationModule.forRoot(),
  ],
  controllers: [
    AppController,
    UserController,
    FriendsController,
    FileUploadController,
    ServersController,
    ChannelsController,
    MessagesController,
    InvitationController,
  ],
  providers: [
    UserService,
    ValidationService,
    FriendsService,
    SocketGateway,
    ServersService,
    ChannelsService,
    MessagesService,
    InvitationService,
    DatabaseService,
  ],
})
export class AppModule {}
