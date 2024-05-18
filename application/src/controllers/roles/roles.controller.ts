import { Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { RolesService } from 'src/services/roles/roles.service';

@Controller('api/v1/roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('all-roles')
  getAllRoles(@Query('serverId') id: string) {
    return this.roleService.getAllRolesInAServer(id);
  }
  @Post('/assign-role')
  assignRole(@Req() req: Request) {
    const { role_id, user_id, permission_id } = req.body;
    return this.roleService.assignRoleToUser(role_id, user_id, permission_id);
  }
  @Put('/update-role')
  updateRole(@Req() req: Request) {
    const {
      color,
      name,
      icon,
      icon_asset_id,
      serverId,
      attach_file,
      ban_member,
      kick_member,
      manage_channel,
      manage_message,
      manage_role,
      manage_thread,
      roleId,
    } = req.body;
    return this.roleService.updateRole(
      color,
      name,
      icon,
      icon_asset_id,
      serverId,
      roleId,
      attach_file,
      ban_member,
      kick_member,
      manage_channel,
      manage_message,
      manage_role,
      manage_thread
    );
  }

  @Post('/create')
  create(@Req() req: Request) {
    const {
      color,
      name,
      icon,
      icon_asset_id,
      serverId,
      attach_file,
      ban_member,
      kick_member,
      manage_channel,
      manage_message,
      manage_role,
      manage_thread,
    } = req.body;

    return this.roleService.createRole(
      color,
      name,
      icon,
      icon_asset_id,
      serverId,
      attach_file,
      ban_member,
      kick_member,
      manage_channel,
      manage_message,
      manage_role,
      manage_thread
    );
  }
}
