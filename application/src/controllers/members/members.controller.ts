import { Controller, Get, Query } from '@nestjs/common';
import { MembersService } from 'src/services/members/members.service';

@Controller('api/v1/members')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get('/list')
  getMembers(@Query('serverId') id: string) {
    return this.memberService.getMemberInServer(id);
  }

  @Get('/is-member-or-author')
  isMemberOrAuthor(
    @Query('userId') userId: string,
    @Query('serverId') serverId: string
  ) {
    return this.memberService.isMemberOrServerAuthor(userId, serverId);
  }
}
