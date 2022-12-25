import { VerifyAuthGuard } from './verify.guard';

describe('VerifyGuard', () => {
  it('should be defined', () => {
    expect(new VerifyAuthGuard(null)).toBeDefined();
  });
});
