import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const jwtStrategy = new JwtStrategy('123');

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate a paylaod', async () => {
    const payload = {
      sub: '123',
      name: 'test',
      email: 'test@test.eu',
    };

    expect(await jwtStrategy.validate(payload)).toEqual({
      id: '123',
      username: 'test',
      email: 'test@test.eu',
    });
  });
});
