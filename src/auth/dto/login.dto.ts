import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogInDto {
    
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email"})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string
}