import { User } from '../../src/user/models/user.model';
import * as crypto from 'crypto';

export const userStub = (
  username = 'Test',
  email = 'test@test.eu',
  password = hash('Test12345678' + 'salt'),
  role = 'user',
  token: string | null = null,
): User => ({
  username,
  email,
  password,
  role,
  token,
});

function hash(password: string) {
  return crypto
    .createHash('sha512')
    .update(JSON.stringify(password))
    .digest('hex');
}
