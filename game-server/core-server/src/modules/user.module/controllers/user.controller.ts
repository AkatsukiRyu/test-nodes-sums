import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserLogic } from '../logics/user.logic';

@Controller('users')
export class UsersControllers {
  constructor(
    private userLogic: UserLogic
  ) { }

  @Get()
  public async findAll(): Promise<string> {
    return 'This action returns all thing';
  }

  @Get(':connected')
  public async tryConnected(@Param('connected') connect: string): Promise<{ connected: boolean }> {
    return {
      connected: true
    }
  }

  @Post('login')
  public async login(@Body() user: { username: string, password: string }): Promise<{ success: boolean, errorMessage?: string; token: string }> {
    return this.userLogic.login(user.username, user.password);
  }
}