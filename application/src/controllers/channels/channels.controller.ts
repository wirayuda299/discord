import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ChannelsService } from 'src/services/channels/channels.service';

@Controller('/api/v1/channels')
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @Get('/:id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }
  @Post('/create')
  createChannel(@Req() req: Request) {
    const { name, server_id, type } = req.body;
    return this.channelService.createChannel(name, server_id, type);
  }
}
