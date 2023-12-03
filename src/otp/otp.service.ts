import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  private otpStorage: Record<string, string> = {};

  async generateOtp(email: string): Promise<string> {
    const otpCode = crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP code
    this.otpStorage[email] = otpCode;

    await this.sendOtpEmail(email, otpCode);

    return otpCode;
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    // Use your email sending logic here, for example, nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service:"gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions, (err) => {
      if(err){
        console.log(err);
      }
      else{
        console.log("Mail Sent")
      }
      
    });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = this.otpStorage[email];
    return storedOtp === otp;
  }
}
