import { Body, Controller, Post } from '@nestjs/common';
import { ThreadsService } from 'src/services/threads/threads.service';

@Controller('api/v1/threads')
export class ThreadsController {
  constructor(private threadService: ThreadsService) {}

  @Post('/create')
  createThread(
    @Body('messageId') msgId: string,
    @Body('userId') userId: string,
    @Body('name') threadName: string,
  ) {
    return this.threadService.createThread(msgId, userId, threadName);
  }
}
