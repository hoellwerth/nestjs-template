import { User } from '../../src/user/models/user.model';
import * as crypto from 'crypto';

export const userStub = (
  username = 'Test',
  email = 'test@test.eu',
  password = '71e7a68b1fd3d6e9ac3de4fd7ff0c450da5c72682e4c6b8672aa7e480841873f684f08d7e3db0159134d6a6d9cbe19b9d6a80c57e36c5cc9bf160e89b0a8e025',
  role = 'user',
  token: string | null = null,
): User => ({
  username,
  email,
  password: hash(password),
  role,
  token,
});

function hash(password: string) {
  return crypto
    .createHash('sha512')
    .update(JSON.stringify(password))
    .digest('hex');
}
