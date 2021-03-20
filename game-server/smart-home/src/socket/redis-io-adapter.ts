import { IoAdapter } from '@nestjs/platform-socket.io';
import {  } from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';

export class RedisIOAdapter extends IoAdapter {
  public createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    //[TODO]: change host and port base on environment
    const redisAdapter = redisIoAdapter({ host: 'localhost', port: 6379 });

    server.adapter(redisAdapter);
    return server;
  }
}
