import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  createParamDecorator,
  ExecutionContext,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ChannelsService } from 'src/services/channels/channels.service';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  }
);

@Controller('/api/v1/channels')
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @Get('/list')
  getAllChannel(@Query('serverId') id: string) {
    return this.channelService.getAllChannelsInServer(id);
  }

  @Get('/:id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }
  @Post('/create')
  createChannel(@Req() req: Request) {
    const { name, server_id, type, userId, serverAuthor } = req.body;

    return this.channelService.createChannel(
      name,
      server_id,
      type,
      userId,
      serverAuthor
    );
  }
}
