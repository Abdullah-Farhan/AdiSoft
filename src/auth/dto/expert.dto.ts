import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class ExpertDto {
    
    @IsNotEmpty()
    readonly name: string

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email"})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string

    @IsNotEmpty()
    @IsString()
    readonly phno: string

    @IsNotEmpty()
    @IsString()
    readonly linkedIn: string

    @IsString()
    @IsNotEmpty()
    readonly domain: string

    @IsNotEmpty()
    @IsString()
    readonly type: string

    readonly verified: boolean
}