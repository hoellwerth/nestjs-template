import { UserStrategy } from './user.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/services/user.service';
import {
  mockUser,
  UserServiceMock,
} from '../../user/services/user.service.spec';
import { ObjectId } from 'mongodb';

describe('UserStrategy', () => {
  let userStrategy: UserStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStrategy,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
      ],
    }).compile();

    userStrategy = module.get<UserStrategy>(UserStrategy);
  });

  it('should be defined', () => {
    expect(userStrategy).toBeDefined();
  });

  it('should validate a request', async () => {
    const userSpy = jest
      .spyOn(UserServiceMock, 'getUserById')
      .mockResolvedValue({ ...mockUser(), id: new ObjectId('123456789101') });

    expect(
      await userStrategy.validateRequest({
        user: { id: '123456789101' },
      }),
    ).toEqual(true);
    expect(userSpy).toBeCalledWith('123456789101');
  });
});
