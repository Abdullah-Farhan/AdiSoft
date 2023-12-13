import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schema/user.schema';
import { OtpModule } from '../otp/otp.module'; // Import the OtpModule
import { GoogleStrategy } from './google.strategy';
import { PasswordReset, PasswordSchema } from './schema/password-reset.schema';
import { Investor, InvestorSchema } from './schema/investor.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Expert, ExpertSchema } from './schema/expert.schema';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: PasswordReset.name, schema: PasswordSchema }]),
    MongooseModule.forFeature([{ name: Investor.name, schema: InvestorSchema }]),
    MongooseModule.forFeature([{ name: Expert.name, schema: ExpertSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE')
          }
        }
      }
    }),
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
