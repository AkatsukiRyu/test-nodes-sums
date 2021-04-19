import { Injectable } from '@nestjs/common';
import { GoogleCalendarAuthService } from '../services';

@Injectable()
export class GoogleLogic {
    constructor(private googleAuthService: GoogleCalendarAuthService) { }

    public async tryConnectToGoogleCalendar(): Promise<any> {
        return this.googleAuthService.readCredentials();

    }
}