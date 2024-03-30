import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from 'src/services/messages/messages.service';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Post('pin-message')
  pinMessage(
    @Body('messageId') msgId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.messageService.pinMessage(msgId, channelId);
  }

  @Get('pinned-messages')
  getPinnedMessages(@Query('channelId') id: string) {
    return this.messageService.getPinnedMessages(id);
  }
}
