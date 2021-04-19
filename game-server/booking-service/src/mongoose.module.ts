import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const MongooseProviders = [{
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect('mongodb://localhost/nest'),
}]

@Module({
    providers: [...MongooseProviders],
    exports: [...MongooseProviders]
})
export class MongooseModule { }