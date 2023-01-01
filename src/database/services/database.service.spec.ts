import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { getConnectionToken } from '@nestjs/mongoose';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getConnectionToken(),
          useValue: 'DatabaseConnection',
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a connection', () => {
    expect(service.getDataBaseHandle()).toBe(getConnectionToken());
  });
});
