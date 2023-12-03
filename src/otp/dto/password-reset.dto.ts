import { IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';

export class PasswordResetDTO {
    @IsNotEmpty()
    readonly email: string;

    @IsOptional()
    @IsStrongPassword()
    readonly password: string

    @IsOptional()
    readonly otp: string;
}
