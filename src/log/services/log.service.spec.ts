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
    expect(log).toHaveBeenLastCalledWith(
      `\x1b[32m[Nest] ${
        process.pid
      }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
      `\x1b[32m    LOG\x1b[0m`,
      `\x1b[33m[Title]\x1b[0m`,
      `\x1b[32mMessage\x1b[0m`,
      `\x1b[33m+0ms\x1b[0m`,
    );
  });

  it('should log an error', async () => {
    const log = jest.spyOn(console, 'log');

    const before = Date.now();

    await service.error('Title', 'Message', before);
    expect(log).toHaveBeenLastCalledWith(
      `\x1b[31m[Nest] ${
        process.pid
      }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
      `\x1b[31m  ERROR\x1b[0m`,
      `\x1b[33m[Title]\x1b[0m`,
      `\x1b[31mMessage`,
      `\x1b[33m+0ms\x1b[0m`,
    );
  });
});
