import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/services/database.service';
import { AppModule } from '../src/app.module';
import { RegisterService } from '../src/user/services/register.service';
import * as request from 'supertest';

describe('Authorization (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let registerService: RegisterService;

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
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('salts').deleteMany({});
    await app.close();
  });

  describe('login', () => {
    it('should login a user', async () => {
      // Register a user
      await registerService.register(
        'test',
        'test',
        'johannes.hoellwerth@protonmail.com',
        'user',
      );

      // Login the user
      const response = await request(httpServer)
        .post('/auth/login')
        .send({ username: 'test', password: 'test' });

      expect(typeof response.text).toBe(typeof '');
      expect(response.text.length).toBe(251);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({});
    });
  });
});
