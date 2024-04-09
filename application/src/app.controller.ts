import clerkClient from '@clerk/clerk-sdk-node';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getUsers() {
    return await clerkClient.clients.getClient(
      'app_2aVi6tWNWvg5UZvTLoyDDAZsgvc',
    );
  }
}
