import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local.guard';
import { VerifyAuthGuard } from '../guard/verify.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /login
  @UseGuards(LocalAuthGuard, VerifyAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<any> {
    return await this.authService.login(req.user);
  }
}
