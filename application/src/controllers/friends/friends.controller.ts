import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FriendsService } from '../../services/friends/friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Post('/add-friend')
  addFriend(
    @Body('followerId') followerId: string,
    @Body('userId') userId: string,
  ) {
    return this.friendService.addFriend(followerId, userId);
  }
  @Post('/remove-friend')
  removeFriend(
    @Body('followerId') followerId: string,
    @Body('userId') userId: string,
  ) {
    return this.friendService.removeFriend(followerId, userId);
  }

  @Get('list-friend')
  getFriendList(@Query('userId') id: string) {
    return this.friendService.getFollowing(id);
  }
}
