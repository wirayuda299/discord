import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { MessagesService } from 'src/services/messages/messages.service';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Post('pin-message')
  pinMessage(
    @Body('messageId') msgId: string,
    @Body('channelId') channelId: string,
    @Body('pinnedBy') author: string,
  ) {
    return this.messageService.pinMessage(msgId, channelId, author);
  }

  @Get('pinned-messages')
  getPinnedMessages(@Query('channelId') id: string) {
    return this.messageService.getPinnedMessages(id);
  }

  @Get('message-channel')
  getMessageChannelById(
    @Query('channel_id') id: string,
    @Query('server_id') serverId: string,
  ) {
    return this.messageService.getMessageByChannelId(id, serverId);
  }

  @Patch('edit-message')
  editMessage(@Req() req: Request) {
    const { messageAuthor, currentUser, messageId, content } = req.body;
    return this.messageService.editMessage(
      messageAuthor,
      currentUser,
      messageId,
      content,
    );
  }
}
