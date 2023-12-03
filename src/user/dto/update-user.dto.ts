import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name: string

    @IsOptional()
    @IsEmail()
    readonly email: string

    @IsOptional()
    @IsStrongPassword()
    readonly password: string

    @IsOptional()
    @IsString()
    readonly type: string
}