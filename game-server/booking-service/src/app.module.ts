import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleCalendarModule } from './modules/google-calendar';
import { MongooseModule } from './mongoose.module';

@Module({
  imports: [
    MongooseModule,
    GoogleCalendarModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
