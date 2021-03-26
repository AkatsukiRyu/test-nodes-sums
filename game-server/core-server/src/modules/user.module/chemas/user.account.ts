import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAccountDocument = UserAccount & Document;

@Schema()
export class UserAccount {

    @Prop({ required: true })
    userName: string;

    @Prop()
    password: string;

    @Prop()
    userId: string;

    @Prop()
    token: string; // temp is pc token; after we can had device token, maybe
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);