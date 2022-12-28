import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log something', async () => {
    const log = jest.spyOn(console, 'log');

    const before = Date.now();

    await service.log('Title', 'Message', before);
    expect(log).toHaveBeenCalled();
  });

  it('should log an error', async () => {
    const log = jest.spyOn(console, 'log');

    const before = Date.now();

    await service.error('Title', 'Message', before);
    expect(log).toHaveBeenCalled();
  });
});
