import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  mockUser,
  UserServiceMock,
} from '../../user/services/user.service.spec';

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

describe('ServicesService', () => {
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
    const mockedUser = {
      username: mockUser().username,
      email: mockUser().email,
      password:
        'dd8c6bc4caae948f9e7c5d440d8c56301598' +
        '276ae30cb7d969743c150dec41ed67ca275b' +
        'f62bda30dbbb5dfb5b7e1e9c522214c48fb4' +
        'eb6a493ff211912cb865',
      role: mockUser().role,
      token: mockUser().token,
    };

    const user = jest
      .spyOn(userService, 'getUserByName')
      .mockResolvedValue(mockedUser);

    const validation = await authService.validateUser(
      mockUser().username,
      mockUser().password,
    );

    expect(user).toHaveBeenCalled();
    expect(validation).toEqual(mockedUser);
  });

  it('should login', async () => {
    const jwtSpy = jest.spyOn(JwtServiceMock, 'sign').mockReturnValue('token');

    const login = await authService.login(mockUser());

    expect(login).toBe('token');
    expect(jwtSpy).toHaveBeenCalled();
  });
});
