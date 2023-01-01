import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserServiceMock } from '../services/user.service.spec';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RegisterService } from '../services/register.service';
import { RegisterServiceMock } from '../services/register.service.spec';
import { VerifyStrategy } from '../../auth/strategy/verify.strategy';
import { UserStrategy } from '../../auth/strategy/user.strategy';
import { AuthService } from '../../auth/services/auth.service';
import { AuthServiceMock } from '../../auth/services/auth.service.spec';
import { userStub } from '../../../test/stubs/user.stub';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let registerService: RegisterService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
        {
          provide: RegisterService,
          useValue: RegisterServiceMock,
        },
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
        {
          provide: VerifyStrategy,
          useValue: {},
        },
        {
          provide: UserStrategy,
          useValue: {},
        },
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    registerService = module.get<RegisterService>(RegisterService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const userSpy = jest.spyOn(registerService, 'register').mockResolvedValue({
      id: '1',
    });

    const user = await controller.register(
      'Johannes Höllwerth',
      process.env.TEST_PASSWORD,
      'johannes.hoellwerth@protonmail.com',
    );

    expect(userSpy).toHaveBeenCalled();
    expect(user.toString()).toBe(
      {
        id: '1',
      }.toString(),
    );
  });

  it('should edit a user', async () => {
    const userSpy = jest.spyOn(userService, 'editUser').mockResolvedValue({
      id: '1',
    });

    const user = await controller.edit(
      { user: { id: Date.now().toString() } },
      process.env.TEST_PASSWORD,
      Date.now().toString(),
    );

    expect(userSpy).toHaveBeenCalled();
    expect(user).toEqual({
      id: '1',
    });
  });

  it('should get the current user', async () => {
    const userSpy = jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue(userStub());

    const user = await controller.getUser({
      user: { id: Date.now().toString() },
    });

    expect(userSpy).toHaveBeenCalled();
    expect({
      ...user,
      password: 'Test12345678',
      token: null,
    }).toEqual(userStub());
  });

  it('should get a user by userid', async () => {
    const userSpy = jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue(userStub());

    const user = await controller.getUserById('1');

    expect(userSpy).toHaveBeenCalled();
    expect({
      ...user,
      password: 'Test12345678',
      token: null,
    }).toEqual(userStub());
  });

  it('should delete a user', async () => {
    const userSpy = jest.spyOn(userService, 'deleteUser').mockResolvedValue({
      success: true,
    });

    const user = await controller.deleteUser({
      user: { id: Date.now().toString() },
    });

    expect(userSpy).toHaveBeenCalled();
    expect(user).toEqual({
      success: true,
    });
  });

  it('should verify a user', async () => {
    const userSpy = jest
      .spyOn(controller, 'verifyUser')
      .mockResolvedValue({ success: true });

    const user = await controller.verifyUser('1');

    expect(userSpy).toHaveBeenCalled();
    expect(user).toEqual({
      success: true,
    });
  });

  it('should send a password confimation', async () => {
    const userSpy = jest
      .spyOn(userService, 'sendPasswordConfirmation')
      .mockResolvedValue({ success: true });

    const user = await controller.forgotPassword(
      'johannes.hoellwerth@protonmail.com',
    );

    expect(userSpy).toHaveBeenCalled();
    expect(user).toEqual({
      success: true,
    });
  });

  it('should reset a password', async () => {
    const userSpy = jest
      .spyOn(userService, 'resetPassword')
      .mockResolvedValue({ success: true });

    const user = await controller.resetPassword('1', 'Test');

    expect(userSpy).toHaveBeenCalled();
    expect(user).toEqual({
      success: true,
    });
  });
});
