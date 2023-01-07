import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import * as crypto from 'crypto';
import { Salt } from '../models/salt.model';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Salt') private readonly saltModel: Model<Salt>,
    private mailService: MailService,
  ) {}

  async getUserById(user_id: string): Promise<any> {
    const user = await this.userModel.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return user;
  }

  async getUserByName(username: string): Promise<any> {
    return this.userModel.findOne({ username: username });
  }

  async getUserByToken(token: string): Promise<any> {
    return this.userModel.findOne({ token: token });
  }

  async deleteUser(user_id: string): Promise<any> {
    const user = await this.userModel.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    this.userModel.findByIdAndDelete(user_id);

    this.saltModel.findOneAndDelete({ userId: user_id });

    return { success: true };
  }

  async editUser(
    user_id: string,
    new_password: string,
    new_username: string,
  ): Promise<any> {
    const user = await this.getUserById(user_id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }
    // get salt from database
    const salt = await this.getSalt(user._id);

    user.password = this.hash(new_password + salt);
    user.username = new_username;

    user.save();

    return { success: true };
  }

  async verifyUser(token: string): Promise<any> {
    if (!token) {
      throw new BadRequestException('No token provided');
    }

    const user = await this.userModel.findOne({ role: token });

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    user.role = 'user';
    user.token = '';

    user.save();

    return { user };
  }

  async sendPasswordConfirmation(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    user.token = this.generateId(12);

    user.save();

    // await this.mailService.sendForgetPassword(user, token);

    return { user: user.username };
  }

  async resetPassword(token: string, new_password: string): Promise<any> {
    const user = await this.getUserByToken(token);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    // get salt from database
    const salt = await this.getSalt(user._id);

    user.password = this.hash(new_password + salt);
    user.token = '';

    user.save();

    await this.mailService.sendPasswordInfo(user);

    return user;
  }

  async getSalt(userId: string): Promise<any> {
    const salt = await this.saltModel.findOne({ userId });

    if (!salt) {
      throw new NotFoundException('salt_not_found');
    }

    return salt.salt;
  }

  hash(password) {
    return crypto
      .createHash('sha512')
      .update(JSON.stringify(password))
      .digest('hex');
  }

  // Generate a random string with a specific length
  generateId(length: number): any {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
