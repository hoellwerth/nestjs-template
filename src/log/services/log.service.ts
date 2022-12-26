import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  log(title: string, message: string, before: number) {
    console.log(
      `\x1b[32m[Nest] ${
        process.pid
      }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
      `\x1b[32m    LOG\x1b[0m`,
      `\x1b[33m[${title}]\x1b[0m`,
      `\x1b[32m${message}\x1b[0m`,
      `\x1b[33m+${Date.now() - before}ms\x1b[0m`,
    );
  }
}
