import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../chemas/user-schema';
import { IUserDto } from '../DTOs/user.model';
import { UserModel } from '../models/user-details.model';


@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  public async getUserById(userId: string): Promise<UserModel> {
    const userProfiles = await this.userModel.findById(userId).exec();
    return this.convertToUserDetailMode(userProfiles);
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  private convertToUserDetailMode(userProfile: IUserDto): Promise<UserModel> {
    return new Promise((resolve) => {
      const userInfo = {
        _id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        avatar: ''
      }

      resolve(userInfo);
    })
  }
}
