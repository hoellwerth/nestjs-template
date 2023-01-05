import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserServiceMock } from '../../user/services/user.service.spec';
import { userStub } from '../../../test/stubs/user.stub';

class JwtServiceMock {
  static sign = jest.fn();
  static signAsync = jest.fn();
  static verify = jest.fn();
  static verifyAsync = jest.fn();
  static decode = jest.fn();
}

export class AuthServiceMock {
  static login = jest.fn();
  static validateUser = jest.fn();
  static hash = jest.fn();
}

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate the credentials', async () => {
    const user = jest
      .spyOn(userService, 'getUserByName')
      .mockResolvedValue(userStub());

    const salt = jest.spyOn(userService, 'getSalt').mockResolvedValue('salt');

    const validation = await authService.validateUser(
      userStub().username,
      'Test12345678',
    );

    expect(salt).toHaveBeenCalled();
    expect(user).toHaveBeenCalled();
    expect(validation).toEqual(userStub());
  });

  it('should login', async () => {
    const jwtSpy = jest.spyOn(JwtServiceMock, 'sign').mockReturnValue('token');

    const login = await authService.login(userStub());

    expect(login).toBe('token');
    expect(jwtSpy).toHaveBeenCalled();
  });
});
