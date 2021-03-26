export class IUserDto {
    readonly _id: string;
    readonly name: string;
    readonly phone: string;
    readonly email: string;
    readonly age: number;
}

export class IUserAccountDto {
    readonly _id: string;
    readonly username: string;
    readonly password: string;
    readonly userId: string;
}
