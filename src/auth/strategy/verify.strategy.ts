import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class VerifyStrategy {
  constructor(private userService: UserService) {}

  async verifyUser(request: any): Promise<any> {
    const user = await this.userService.getUserById(request.user.id);

    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return (
      user.role === 'user' || user.role === 'moderator' || user.role === 'admin'
    );
  }
}
