import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserService } from '../services/user.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { VerifyAuthGuard } from '../../auth/guard/verify.guard';
import { AuthService } from '../../auth/services/auth.service';
import { UserAuthGuard } from '../../auth/guard/user.guard';

@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerService: RegisterService,
    private readonly userService: UserService,
  ) {}

  // POST /register
  @Post('register')
  register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): any {
    return this.registerService.register(username, password, email, null);
  }

  // PATCH /edit
  @UseGuards(JwtAuthGuard, UserAuthGuard, VerifyAuthGuard)
  @Patch('edit')
  edit(
    @Request() req: any,
    @Body('new_password') new_password: string,
    @Body('new_username') new_username: string,
  ): any {
    return this.userService.editUser(req.user.id, new_password, new_username);
  }

  // GET /get
  @UseGuards(JwtAuthGuard, UserAuthGuard, VerifyAuthGuard)
  @Get('get')
  async getUser(@Request() req: any): Promise<any> {
    const user = await this.userService.getUserById(req.user.id);

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  // GET /getuser/:user_id
  @Get('getuser/:userId')
  async getUserById(@Param('userId') userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  // DELETE /
  @UseGuards(JwtAuthGuard, UserAuthGuard, VerifyAuthGuard)
  @Delete('')
  async deleteUser(@Request() req: any) {
    return this.userService.deleteUser(req.user.id);
  }

  // PATCH /verify
  @Patch('verify')
  async verifyUser(@Body('token') token: string): Promise<any> {
    return this.userService.verifyUser(token);
  }

  // GET forget-password/:email
  @Get('forget-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<any> {
    return this.userService.sendPasswordConfirmation(email);
  }

  // PATCH reset-password
  @Patch('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('new_password') password: string,
  ): Promise<any> {
    return this.userService.resetPassword(token, password);
  }
}
