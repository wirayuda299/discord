import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ThreadsService } from 'src/services/threads/threads.service';

@Controller('api/v1/threads')
export class ThreadsController {
  constructor(private threadService: ThreadsService) {}

  @Post('/create')
  createThread(
    @Body('messageId') msgId: string,
    @Body('userId') userId: string,
    @Body('name') threadName: string,
    @Body('image') imageUrl: string,
    @Body('message') message: string,
    @Body('imageAssetId') imageAssetId: string,
    @Body('channelId') channelId: string
  ) {
    return this.threadService.createThread(
      msgId,
      userId,
      imageUrl,
      imageAssetId,
      message,
      channelId,
      threadName
    );
  }

  @Get('all-threads')
  getAllThreads(
    @Query('channelId') channelId: string,
    @Query('serverId') serverId: string
  ) {
    return this.threadService.getAllThreads(channelId, serverId);
  }
}
