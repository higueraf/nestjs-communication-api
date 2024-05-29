import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from '../user/user-session.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/notification.entity';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.entity';

import { UserGateway } from './user.gateway';
import { UserSettingService } from 'src/user/user-setting.service';
import { UserSessionService } from 'src/user/user-session.service';
import { UserSetting } from 'src/user/user-setting.entity';
import { Log } from 'src/log/log.entity';
import { LogService } from 'src/log/log.service';
import { NotificationTypeService } from 'src/notification/notification-type.service';
import { NotificationType } from 'src/notification/notification-type.entity';
import { EmailService } from 'src/email/email.service';
import { CommonWebsocketService } from './common-websocket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Log,
      Notification,
      NotificationType,
      UserSession,
      UserSetting,
    ]),
  ],
  providers: [
    CommonWebsocketService,
    LogService,
    EmailService,
    NotificationService,
    NotificationTypeService,
    UserGateway,
    UserService,
    UserSessionService,
    UserSettingService,
    WebsocketGateway,
    WebsocketService,
  ],
  exports: [CommonWebsocketService],
})
export class WebsocketModule {}
