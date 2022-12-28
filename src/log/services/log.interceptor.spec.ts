import { LogInterceptor } from './log.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

describe('LogInterceptor', () => {
  it('should be defined', () => {
    expect(new LogInterceptor()).toBeDefined();
  });

  it('should log', () => {
    const interceptor = new LogInterceptor();
    jest.spyOn(console, 'log');

    const now = Date.now();

    const context = {
      getArgs: () => [
        {
          url: 'http://localhost:3000',
          method: 'GET',
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
          },
          ip: '0.0.0.0',
        },
      ],
    };

    const next = {
      handle: () => {
        return {
          pipe(): Observable<any> {
            console.log(
              `\x1b[32m[Nest] ${
                process.pid
              }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
              `\x1b[32m    LOG\x1b[0m`,
              `\x1b[33m[RouteCalled]\x1b[0m`,
              `\x1b[32mCalled {${context.getArgs()[0].url}`,
              `${context.getArgs()[0].method}},`,
              `Client: {${context.getArgs()[0].headers['user-agent']},`,
              `${context.getArgs()[0].ip}}`,
              `\x1b[33m${Date.now() - now}ms\x1b[0m`,
            );

            const e = {
              response: {
                statusCode: 404,
                message: 'Not Found',
              },
            };

            console.log(
              `\x1b[31m[Nest] ${
                process.pid
              }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
              `\x1b[31m  ERROR\x1b[0m`,
              `\x1b[33m[ExceptionHandler]\x1b[0m`,
              `\x1b[31mCalled {${context.getArgs()[0].url},`,
              `${context.getArgs()[0].method}},`,
              `Error: {${e.response ? e.response.statusCode : e} ${
                e.response ? e.response.message : ''
              }},`,
              `Client: {${context.getArgs()[0].headers['user-agent']},`,
              `${context.getArgs()[0].ip}}`,
              `\x1b[33m${Date.now() - now}ms\x1b[0m`,
            );

            return new Observable();
          },
        };
      },
    };

    interceptor.intercept(context as ExecutionContext, next as CallHandler);

    expect(console.log).toBeCalled();
  });
});
