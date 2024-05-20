import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

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

  @Post('/kick')
  kickMemberFromServer(@Req() req: Request) {
    const { serverId, memberId, serverAuthor, currentUser } = req.body;
    return this.memberService.kickMember(
      serverId,
      memberId,
      serverAuthor,
      currentUser
    );
  }
  @Post('/ban')
  async banMember(@Req() req: Request) {
    const { serverId, memberId, bannedBy } = req.body;
    return await this.memberService.banMember(serverId, memberId, bannedBy);
  }
}
