import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDto } from '../DTOs/user.model';
import { UserAccount, UserAccountDocument } from '../chemas/user.account';


@Injectable()
export class UserAccountService {
    constructor(
        @InjectModel(UserAccount.name) private userAccountModel: Model<UserAccountDocument>
    ) { }

    public async create(userInfo: IUserDto): Promise<UserAccount> {
        const createdCat = new this.userAccountModel(userInfo);
        return createdCat.save();
    }

    public async createToken(): Promise<UserAccount[]> {
        return this.userAccountModel.find().exec();
    }

    public async findUserAccountByUserName(userName: string): Promise<UserAccount> {
        return this.userAccountModel.findById(userName).exec()
    }

    public async updateAccount(userName: string, token: string): Promise<boolean> {
        const account = await this.userAccountModel.findById(userName);

        if (!account) {
            return new Promise(resolve => resolve(false));
        }

        account.token = token;
        await this.userAccountModel.findByIdAndUpdate(userName, account);

        return new Promise(resolve => resolve(true));
    }
}