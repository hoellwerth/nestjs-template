import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { LocalAuthGuard } from '../guard/local.guard';
import { VerifyAuthGuard } from '../guard/verify.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // POST /login
  @UseGuards(LocalAuthGuard, VerifyAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<any> {
    const token = await this.authService.login(req.user);
    const user = await this.userService.getUserByName(req.user.username);

    return {
      access_token: token,
      id: user._id,
      role: user.role,
    };
  }
}
