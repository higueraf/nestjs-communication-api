import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Company } from '../company/company.entity';
import { CompanyUser } from '../company/company-user.entity';
import { UserSettingService } from './user-setting.service';
import { UserSetting } from './user-setting.entity';
import { AuthModule } from '../auth/auth.module';
import { CompanyService } from '../company/company.service';
import { Subscription } from 'rxjs';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyUser,
      Subscription,
      User,
      UserSetting,
    ]),
    AuthModule,
  ],
  providers: [CompanyService, UserService, UserSettingService],
  exports: [CompanyService, UserService, UserSettingService],
})
export class UserModule {}
