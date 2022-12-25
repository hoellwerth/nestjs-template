import { UserAuthGuard } from './user.guard';

describe('UserGuard', () => {
  it('should be defined', () => {
    expect(new UserAuthGuard(null)).toBeDefined();
  });
});
