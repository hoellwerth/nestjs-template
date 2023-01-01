import { Test, TestingModule } from '@nestjs/testing';
import { VerifyStrategy } from './verify.strategy';
import { UserService } from '../../user/services/user.service';
import { UserServiceMock } from '../../user/services/user.service.spec';
import { userStub } from '../../../test/stubs/user.stub';

describe('VerifyStrategy', () => {
  let verifyStrategy: VerifyStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyStrategy,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
      ],
    }).compile();

    verifyStrategy = module.get<VerifyStrategy>(VerifyStrategy);
  });

  it('should be defined', () => {
    expect(verifyStrategy).toBeDefined();
  });

  it('should verify a user', async () => {
    const userSpy = jest
      .spyOn(UserServiceMock, 'getUserById')
      .mockResolvedValue(userStub());

    expect(await verifyStrategy.verifyUser({ user: { id: '123' } })).toEqual(
      true,
    );
    expect(userSpy).toBeCalledWith('123');
  });
});
