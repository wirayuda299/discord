import { Controller, Get, Query } from '@nestjs/common';
import { MembersService } from 'src/services/members/members.service';

@Controller('api/v1/members')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get()
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

  @Get('/by-role')
  getMemberWithRole(
    @Query('roleName') roleName: string,
    @Query('serverId') serverId: string
  ) {
    return this.memberService.getMembersFromSpesificRole(serverId, roleName);
  }

  @Get('/without-role')
  getMemberWithNoRole(@Query('serverId') serverId: string) {
    return this.memberService.getMembersHasNoRole(serverId);
  }
}
