import { UserAccountService } from './../services/user-account.service';
import { Injectable } from '@nestjs/common';
import { UserInfoService } from '../services/user.service';
import { UserModel } from '../models/user-details.model';

@Injectable()
export class UserLogic {
    constructor(
        private userService: UserInfoService,
        private accountService: UserAccountService
    ) { }

    public async login(userId: string, password: string): Promise<{ success: boolean, errorMessage?: string; token: string }> {
        const account = await this.accountService.findUserAccountByUserName(userId);
        if (!account) {
            return new Promise(resolve => resolve({ success: false, errorMessage: 'Something wrong with your user name or password', token: '' }));
        }

        // try to pattern password by secret key ( this handle for front end and back end )
        // handle logic here then

        const realPassword = this.patternPassword(password);

        if (realPassword !== password) {
            return new Promise(resolve => resolve({ success: false, errorMessage: 'Something wrong with your user name or password', token: '' }));
        }

        const userInfo = await this.userService.getUserById(account.userId);
        const token = this.generateToken(userInfo)

        try {
            await this.accountService.updateAccount(account.userName, token);
            return new Promise(resolve => resolve({ success: true, token: token }))
        } catch (err) {
            return new Promise(resolve => resolve({ success: false, errorMessage: 'Something wrong with your user name or password', token: '' }));
        }
    }

    private patternPassword(password: string): string {
        return password
    }

    private generateToken(userInfo: UserModel): string {
        // creat JWT token
        return 'token';
    }
}