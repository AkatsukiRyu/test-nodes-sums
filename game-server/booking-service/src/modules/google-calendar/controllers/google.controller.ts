import { Controller, Get } from '@nestjs/common';
import { GoogleLogic } from '../logics';

@Controller('gg')
export class GoogleController {
    constructor(private googleLogic: GoogleLogic) { }

    @Get('auth')
    public getGGAuth(): Promise<any> {
        return this.googleLogic.tryConnectToGoogleCalendar();
    }
}
