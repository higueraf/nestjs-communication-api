import { Module } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTypeService } from './notification-type.service';
import { NotificationType } from './notification-type.entity';
import { LogService } from '../log/log.service';
import { Log } from '../log/log.entity';
import { EmailService } from '../email/email.service';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [NotificationController],
  imports: [
    TypeOrmModule.forFeature([Log, Notification, NotificationType]),
    WebsocketModule,
  ],
  providers: [
    EmailService,
    LogService,
    NotificationService,
    NotificationTypeService,
  ],
  exports: [NotificationService, NotificationTypeService],
})
export class NotificationModule {}
