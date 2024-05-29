import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyUser } from './company-user.entity';
import { CompanyController } from './company.controller';
import { UserService } from '../user/user.service';
import { UserSettingService } from '../user/user-setting.service';
import { User } from '../user/user.entity';
import { UserSetting } from '../user/user-setting.entity';
import { LogService } from '../log/log.service';
import { Log } from 'src/log/log.entity';

@Module({
  controllers: [CompanyController],
  imports: [
    TypeOrmModule.forFeature([Company, CompanyUser, Log, User, UserSetting]),
  ],
  providers: [CompanyService, LogService, UserService, UserSettingService],
  exports: [CompanyService],
})
export class CompanyModule {}
