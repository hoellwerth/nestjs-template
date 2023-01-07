import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/services/database.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { RegisterService } from '../src/user/services/register.service';
import { MailService } from '../src/mail/services/mail.service';

describe('User (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let registerService: RegisterService;
  let mailService: MailService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDataBaseHandle();
    httpServer = app.getHttpServer();
    registerService = moduleRef.get<RegisterService>(RegisterService);
    mailService = moduleRef.get<MailService>(MailService);

    mailService.e2eRunning = true;
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    // delete all test data
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('salts').deleteMany({});

    // close the app
    await app.close();

    mailService.e2eRunning = false;
  });

  describe('GET /user/getuser/:userId', () => {
    it('should return a user', async () => {
      // create a test user
      const id = await registerService.register(
        'test2',
        'test2',
        'test@test.eu',
        'user',
      );

      // get the user
      const response = await request(httpServer).get(`/user/getuser/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        username: 'test2',
        email: 'test@test.eu',
        role: 'user',
      });
    });
  });

  describe('DEL /user/', () => {
    it('delete a user', async () => {
      // create a test user
      const id = await registerService.register(
        'test3',
        'test3',
        'test3@test.eu',
        'user',
      );

      // login the user
      const accessToken = await request(httpServer)
        .post('/auth/login')
        .send({ username: 'test3', password: 'test3' });

      // delete the user
      const response = await request(httpServer)
        .del('/user')
        .set('Authorization', 'bearer ' + accessToken.text)
        .send({ id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('PATCH /user/edit', () => {
    it('update a user', async () => {
      // create a test user
      const id = await registerService.register(
        'test4',
        'test4',
        'test4@test.eu',
        'user',
      );

      // login the user
      const accessToken = await request(httpServer)
        .post('/auth/login')
        .send({ username: 'test4', password: 'test4' });

      // update the user
      const response = await request(httpServer)
        .patch('/user/edit')
        .set('Authorization', 'bearer ' + accessToken.text)
        .send({ id, new_password: 'test4', new_username: 'test4' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('GET /user/forget-password/:email', () => {
    it('get a password reset token', async () => {
      // create a test user
      await registerService.register('test5', 'test5', 'test5@test.eu', 'user');

      // get the password reset token
      const response = await request(httpServer).get(
        `/user/forget-password/test5@test.eu`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: 'test5' });
    });
  });
});
