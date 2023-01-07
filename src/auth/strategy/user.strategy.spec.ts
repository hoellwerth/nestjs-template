import { UserStrategy } from './user.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/services/user.service';
import { UserServiceMock } from '../../user/services/user.service.spec';
import { ObjectId } from 'mongodb';
import { userStub } from '../../../test/stubs/user.stub';

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
      .mockResolvedValue({ ...userStub(), id: new ObjectId('123456789101') });

    expect(
      await userStrategy.validateRequest({
        user: { id: '123456789101' },
      }),
    ).toEqual(true);
    expect(userSpy).toBeCalledWith('123456789101');
  });
});
