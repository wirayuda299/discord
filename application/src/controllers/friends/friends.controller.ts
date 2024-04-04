import { Controller, Get, Query } from '@nestjs/common';
import { FriendsService } from '../../services/friends/friends.service';

@Controller('api/v1/friends')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Get('list-friend')
  getFriendList(@Query('userId') id: string) {
    return this.friendService.getFriends(id);
  }
}
