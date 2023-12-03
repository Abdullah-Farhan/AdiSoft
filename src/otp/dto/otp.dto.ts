import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly otp: string;
}
