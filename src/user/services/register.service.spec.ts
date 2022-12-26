import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Salt } from '../models/salt.model';
import { UserService } from './user.service';
import { MailService } from '../../mail/services/mail.service';
import { mockUser, UserModel, UserServiceMock } from './user.service.spec';
import { MailServiceMock } from '../../mail/services/mail.service.spec';
import { getModelToken } from '@nestjs/mongoose';
import * as crypto from 'crypto';

export class SaltModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([]);
  static findOne = jest.fn().mockResolvedValue([]);
  static findOneAndUpdate = jest.fn().mockResolvedValue([]);
  static deleteOne = jest.fn().mockResolvedValue(true);
  static findById = jest.fn().mockResolvedValue([]);
  static findByIdAndDelete = jest.fn().mockResolvedValue(true);
  static findOneAndDelete = jest.fn().mockResolvedValue(true);
}

export class RegisterServiceMock {
  static register = jest.fn();
  static salt = jest.fn();
  static verify = jest.fn();
  static generateId = jest.fn();
}

describe('RegisterService', () => {
  let service: RegisterService;
  let userService: UserService;
  let mailService: MailService;
  let userModel: Model<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let saltModel: Model<Salt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
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

    service = module.get<RegisterService>(RegisterService);
    userService = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    saltModel = module.get<Model<Salt>>(getModelToken('Salt'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const userSpy = jest
      .spyOn(userService, 'getUserByName')
      .mockResolvedValue(null);

    const mailSpy = jest.spyOn(mailService, 'sendUserConfirmation');

    const hashSpy = jest.spyOn(service, 'hash');

    const emailSpy = jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const user = await service.register(
      mockUser().username,
      mockUser().email,
      mockUser().password,
    );

    expect(user.success).toBeUndefined();
    expect(userSpy).toBeCalled();
    expect(hashSpy).toBeCalled();
    expect(mailSpy).toBeCalled();
    expect(emailSpy).toBeCalled();
  });

  it('should return a password additional 16 random letters', async () => {
    const randomizationSpy = jest
      .spyOn(service, 'generateId')
      .mockResolvedValue('12345678');

    const password = service.salt(mockUser().password);

    expect(password.slice(mockUser().password.length).length).toBe(16);
    expect(randomizationSpy).toBeCalled();
  });

  it('should return a hashed password', async () => {
    const hash = service.hash('1234');

    expect(hash).toEqual(
      crypto.createHash('sha512').update(JSON.stringify('1234')).digest('hex'),
    );
  });
});
