import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { VerifyOtpDto } from '../otp/dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { PasswordResetDTO } from 'src/otp/dto/password-reset.dto';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{token: string}> {
        return this.authService.signUp(signUpDto);
    }

    @Get('/login')
    login(@Body() logInDto: LogInDto): Promise<{token: string}> {
        return this.authService.login(logInDto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
        const { email, otp } = verifyOtpDto;
        const isValid = await this.authService.verifyOtp(email, otp);

        if (isValid) {
            return { message: 'OTP verified successfully' };
        } else {
            throw new UnauthorizedException('Invalid OTP');
        }
    }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        const data = this.authService.googleLogin(req)
        console.log(data);
        return data;
    }

    @Post('request')
    async requestPasswordReset(@Body() passwordDto: PasswordResetDTO) {
        return this.authService.requestPasswordReset(passwordDto);
    }

    @Post('confirm')
    async confirmPasswordReset(@Body() passwordDto: PasswordResetDTO) {
        return this.authService.confirmPasswordReset(passwordDto);
    }
}

