import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OtpService } from './otp/otp.service';
import { OtpController } from './otp/otp.controller';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO),
    UserModule,
    AuthModule,
    OtpModule,
  
  ],
  controllers: [AppController, OtpController],
  providers: [AppService, OtpService],
})
export class AppModule {}
