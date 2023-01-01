import { User } from '../../src/user/models/user.model';

export const userStub = (
  username = 'Test',
  email = 'test@test.eu',
  password = 'Test12345678',
  role = 'user',
  token: string | null = null,
): User => ({
  username,
  email,
  password,
  role,
  token,
});
