import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  async generateOtp(@Body('email') email: string) {
    const otpCode = await this.otpService.generateOtp(email);
    // Send the OTP code to the user's email
    // (you can use a real email service here)
    console.log(`Generated OTP for ${email}: ${otpCode}`);
    return { message: 'OTP generated successfully' };
  }

  @Post('verify')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    const isValid = await this.otpService.verifyOtp(email, otp);
    if (isValid) {
      // Perform actions when OTP is valid (e.g., mark email as verified)
      return { message: 'OTP verified successfully' };
    } else {
      return { message: 'Invalid OTP' };
    }
  }
}
