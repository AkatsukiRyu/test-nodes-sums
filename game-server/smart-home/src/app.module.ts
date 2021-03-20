import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmartHomeGateway } from './socket/gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SmartHomeGateway],
})
export class AppModule {}
