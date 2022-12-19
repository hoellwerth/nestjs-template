import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { Salt } from '../models/salt.model';
import { MailService } from '../../mail/services/mail.service';
import { MailServiceMock } from '../../mail/services/mail.service.spec';
import { getModelToken } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { SaltModel } from './register.service.spec';

export const mockUser = (
  username = 'Test',
  email = 'test@test.eu',
  password = 'Test12345678',
  role = 'user',
  token: string | null = null,
): User => ({
  username,
  email,
  password,
  role,
  token,
});

export class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue(mockUser());
  static findOne = jest.fn().mockResolvedValue(mockUser());
  static findOneAndUpdate = jest.fn().mockResolvedValue(mockUser());
  static deleteOne = jest.fn().mockResolvedValue(true);
  static findById = jest.fn().mockResolvedValue(mockUser());
  static findByIdAndDelete = jest.fn().mockResolvedValue(true);
  static findOneAndDelete = jest.fn().mockResolvedValue(true);
}

export class UserServiceMock {
  static getUserById = jest.fn();
  static getUserByName = jest.fn().mockResolvedValue(mockUser());
  static getUserByToken = jest.fn();
  static deleteUser = jest.fn();
  static editUser = jest.fn();
  static verifyUser = jest.fn();
  static sendPasswordConfirmation = jest.fn();
  static resetPassword = jest.fn();
  static getSalt = jest.fn();
  static hash = jest.fn();
  static generateId = jest.fn();
}

describe('UserService', () => {
  let userService: UserService;
  let mailService: MailService;
  let userModel: Model<User>;
  let saltModel: Model<Salt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MailService,
          useValue: MailServiceMock,
        },
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        {
          provide: getModelToken('Salt'),
          useValue: SaltModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    saltModel = module.get<Model<Salt>>(getModelToken('Salt'));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should get user by id', async () => {
    const user = await userService.getUserById('1');

    expect(user).toEqual(mockUser());
  });

  it('should get user by name', async () => {
    const user = await userService.getUserByName('');

    expect(user).toEqual(mockUser());
  });

  it('should get user by token', async () => {
    const userModelSpy = jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue(mockUser());

    const user = await userService.getUserByToken('Token');

    expect(user).toEqual(mockUser());
    expect(userModelSpy).toBeCalled();
  });

  it('should delete user', async () => {
    const user = await userService.deleteUser('1');

    expect(user.toString()).toBe({ success: true }.toString());
  });

  it('should edit user', async () => {
    const salt = await jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue({
        save: () => {
          return null;
        },
      });

    const user = await userService.editUser('id', '1234', 'Lol');

    expect(user).toEqual({ success: true });
    expect(salt).toHaveBeenCalled();
  });

  it('should verify user', async () => {
    const userSpy = jest
      .spyOn(userService, 'getUserByToken')
      .mockResolvedValue({
        save: () => {
          return null;
        },
      });

    const user = await userService.verifyUser('id');

    expect(user.toString()).toEqual(
      {
        user: {
          save: () => {
            return null;
          },
          role: 'user',
          token: '',
        },
      }.toString(),
    );
    expect(userSpy).toHaveBeenCalled();
  });

  it('should send password confirmation', async () => {
    const mail = jest.spyOn(mailService, 'sendForgetPassword');
    const userSpy = jest.spyOn(userModel, 'findOne').mockResolvedValue({
      ...mockUser(),
      save: () => {
        return null;
      },
    });

    const user = await userService.sendPasswordConfirmation('id');

    expect(user).toEqual({ user: 'Test' });
    expect(mail).toHaveBeenCalled();
    expect(userSpy).toHaveBeenCalled();
  });

  it('should reset password', async () => {
    const userSpy = jest
      .spyOn(userService, 'getUserByToken')
      .mockResolvedValue({
        save: () => {
          return null;
        },
      });

    const saltSpy = jest
      .spyOn(userService, 'getSalt')
      .mockResolvedValue('1234');

    const user = await userService.resetPassword('id', '1234');

    expect(user.toString()).toEqual(
      {
        password: userService.hash('1234' + '1234'),
        token: '',
        save: () => {
          return null;
        },
      }.toString(),
    );
    expect(userSpy).toHaveBeenCalled();
    expect(saltSpy).toHaveBeenCalled();
  });

  it('should get salt', async () => {
    const saltSpy = jest
      .spyOn(saltModel, 'findOne')
      .mockResolvedValue({ salt: '1234' });

    const salt = await userService.getSalt('id');

    expect(salt).toEqual('1234');
    expect(saltSpy).toHaveBeenCalled();
  });

  it('should hash', async () => {
    const hash = userService.hash('1234');

    expect(hash).toEqual(
      crypto.createHash('sha512').update(JSON.stringify('1234')).digest('hex'),
    );
  });

  it('should generate id', async () => {
    const id = userService.generateId(16);

    expect(id).toHaveLength(16);
  });
});
