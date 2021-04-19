import { Module } from '@nestjs/common';
import { GoogleController } from './controllers/google.controller';
import { GoogleLogic } from './logics';
import { GoogleCalendarAuthService } from './services';

@Module({
    imports: [],
    controllers: [GoogleController],
    providers: [GoogleCalendarAuthService, GoogleLogic]
})
export class GoogleCalendarModule { }
