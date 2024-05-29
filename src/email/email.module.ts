import { Module } from '@nestjs/common';
import { EmailsController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySetting } from 'src/company/company-setting.entity';

@Module({
  controllers: [EmailsController],
  imports: [TypeOrmModule.forFeature([CompanySetting])],
  providers: [EmailService],
})
export class EmailsModule {}
