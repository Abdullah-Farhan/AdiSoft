import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { OtpService } from '../otp/otp.service';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer'
import { PasswordResetDTO } from 'src/otp/dto/password-reset.dto';
import { PasswordReset } from './schema/password-reset.schema';
import { InvestorDto } from './dto/investor.dto';
import { Investor } from './schema/investor.schema'
import { ExpertDto } from './dto/expert.dto';
import { Expert } from './schema/expert.schema';
import exp from 'constants';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(PasswordReset.name)
        private passwordReset: Model<PasswordReset>,
        @InjectModel(Investor.name)
        private investorModel: Model<Investor>,
        @InjectModel(Expert.name)
        private expertModel: Model<Expert>,
        private jwtService: JwtService,
        private otpService: OtpService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string}>{
        const { name, email, password, type, otp, verified } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const otpCode = await this.otpService.generateOtp(email);

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            type,
            otp:otpCode,
            verified,
        })

        const token = this.jwtService.sign({id: user._id})

        return { token }
    }

    async signUpInvestor(signUpDto: InvestorDto): Promise<{ token: string}>{
        const { name, email, password, phno, type, investings, details, verified } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.investorModel.create({
            name,
            email,
            password: hashedPassword,
            phno,
            type:"investor",
            investings,
            details,
            verified,
        })

        const token = this.jwtService.sign({id: user._id})

        return { token }
    }

    async signUpExpert(signUpDto: ExpertDto): Promise<{ token: string}>{
        const { name, email, password, phno, linkedIn, domain, type, verified } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.expertModel.create({
            name,
            email,
            password: hashedPassword,
            phno,
            linkedIn,
            domain,
            type:"expert",
            verified,
        })

        const token = this.jwtService.sign({id: user._id})

        return { token }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const user = await this.userModel.findOne({email});
        if(user.otp == otp){
            const filter = {email: email};
            const update = {verified: true};
            await this.userModel.findOneAndUpdate(filter, update)
            return true
        }
        else{
            throw new UnauthorizedException("Invalid Otp.")
            return false
        }
    }

    async login(logInDto: LogInDto): Promise<{token: string}>{
        const { email, password } = logInDto;

        const user = await this.userModel.findOne({email})
        const investor = await this.investorModel.findOne({email})
        const expert = await this.expertModel.findOne({email})
        var token = '';

        if(!user) {
            if(!investor){
                if(!expert){
                    throw new UnauthorizedException("User does not Exist!")
                }
            }
        }
        //Validating Password
        if(user){
            const isPasswordMatched = await bcrypt.compare(password, user.password)
            if(!isPasswordMatched) {
                throw new UnauthorizedException("Invalid Password")
            }
            if(!user.verified){
                throw new UnauthorizedException("verify Your Email First")
            }
            token = this.jwtService.sign({id: user._id})
            console.log(user);
            
        }

        else if(investor){
            const isPasswordMatched = await bcrypt.compare(password, investor.password)
            if(!isPasswordMatched) {
                throw new UnauthorizedException("Invalid Password")
            }
            if(!investor.verified){
                throw new UnauthorizedException("Wait for Your Account to be Verified!")
            }
            token = this.jwtService.sign({id: investor._id})
            console.log(investor);
            
        }

        else if(expert){
            const isPasswordMatched = await bcrypt.compare(password, expert.password)
            if(!isPasswordMatched) {
                throw new UnauthorizedException("Invalid Password")
            }
            if(!expert.verified){
                throw new UnauthorizedException("Wait for Your Account to be Verified!")
            }
            token = this.jwtService.sign({id: expert._id})
            console.log(expert);
            
        }

        return { token }
    }

    async googleLogin(req){
        if(!req.user){
            return "No User Found"
        }
        return {
            message: "User Info from Google",
            user: req.user,
        }
    }

    async requestPasswordReset(passwordDTO: PasswordResetDTO) {
        const user = await this.userModel.findOne({'email':passwordDTO.email});
    
        const { email, otp } = passwordDTO;
    
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        // Generate and save OTP
        const otpCode = crypto.randomBytes(3).toString('hex');
    
        const passwordReset = await this.passwordReset.create({
            email,
            otp: otpCode,
        })
    
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service:"gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'nyomsnyom@gmail.com',
              pass: 'hhai uplj asls schm',
            },
          });
      
          const mailOptions = {
            from: 'nyomsnyom@gmail.com',
            to: passwordDTO.email,
            subject: 'OTP Verification',
            text: `Your OTP for Password Reset is: ${otpCode}`,
          };
      
          await transporter.sendMail(mailOptions, (err) => {
            if(err){
              console.log(err);
            }
            else{
              console.log("Mail Sent")
            }
            
          });
    
        return { message: 'Password reset email sent successfully' };
      }
    
      async confirmPasswordReset(passwordDTO: PasswordResetDTO) {
        // Validate OTP
        const resetPassword = await this.passwordReset.findOne({email: passwordDTO.email});
        const user = await this.userModel.findOne({email: passwordDTO.email});
    
        if(resetPassword.otp === passwordDTO.otp){
            const password = passwordDTO.password
            const hashedPassword = await bcrypt.hash(password, 10)

            const filter = {'email':user.email}
            const update = {'password':hashedPassword}
            await this.userModel.findOneAndUpdate(filter, update);
    
            await this.passwordReset.findOneAndDelete({'email': passwordDTO.email})
    
            return { message: 'Password reset successful' };
            
        }
    
        else {
            throw new BadRequestException("Incorrect Otp!")
        }
      }
}
