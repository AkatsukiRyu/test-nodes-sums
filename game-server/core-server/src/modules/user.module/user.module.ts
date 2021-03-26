import { UserAccountService } from './services/user-account.service';
import { UsersControllers } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './chemas/user-schema';
import { UserAccount, UserAccountSchema } from './chemas/user.account';
import { UserInfoService } from './services/user.service';
import { UserLogic } from './logics/user.logic';

// refactor import, provider and controllers too
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: UserAccount.name, schema: UserAccountSchema }])],
    controllers: [UsersControllers],
    providers: [UserInfoService, UserAccountService, UserLogic],
})
export class UsersModule { }