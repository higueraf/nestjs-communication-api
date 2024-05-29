import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { websocketConfig } from './websocket-config';
import { NotificationTypeEnum } from '../share/enum/notification-type.enum';
import { Types } from 'mongoose';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { Logger } from '@nestjs/common';
import { UserSessionService } from '../user//user-session.service';
import { WebsocketGateway } from './websocket.gateway';
import { UserSettingService } from 'src/user/user-setting.service';
import { uuid } from 'uuidv4';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';

@WebSocketGateway(websocketConfig)
export class UserGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userSettingService: UserSettingService,
    private readonly notificationService: NotificationService,
    private readonly userSessionsService: UserSessionService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @SubscribeMessage('User Edit Profile')
  async handleUserEditProfile(client: Socket, args: any): Promise<void> {
    console.log('User Edit Profile');
    const notificationGroupId = new Types.ObjectId();
    const userSetting = await this.userSettingService.findByCompanyUserID(
      args.from,
    );
    await this.userSettingService.updateByCompanyUserID(args.from);
    const UserEditProfileNotificationArgs = {
      profile: args.newProfile,
      from: args.from,
      fromName: userSetting.companyUser.user?.Name ?? '',
    };
    const notification: Notification = new Notification();
    notification.NotificationID = uuid();
    notification.Message = 'Testing Message';
    notification.Title = 'Testing';
    notification.SendType = SendTypeEnum.WEBSOCKET;
    notification.CreatedBy = userSetting.companyUser.UserID;
    await this.notificationService.create(notification);

    this.server
      .to(`personal:${args.userId.toUpperCase()}`)
      .emit('New Notification', {
        notificationGroupId: notificationGroupId,
        type: NotificationTypeEnum.USER_EDIT_PROFILE,
        ...UserEditProfileNotificationArgs,
      });
  }

  @SubscribeMessage('user-active')
  async handleUserActive(client: Socket) {
    const companyUserId =
      this.websocketGateway.decodedToken(client).companyUserId;
    Logger.log(
      `====> User Active ${companyUserId}. Refreshing/Creating Session`,
    );

    const fetchUserSession =
      await this.userSessionsService.getSessionByUserId(companyUserId);

    const ipAddress =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;

    Logger.log(
      `====>  User IP ${
        client.handshake.headers['x-forwarded-for'] || client.handshake.address
      }`,
    );

    if (!fetchUserSession) {
      Logger.log(`====> Creating new session for user ${companyUserId}`);
      await this.userSessionsService.createNewSession(
        companyUserId,
        ipAddress,
        new Date(),
      );
      return;
    }

    if (fetchUserSession.Expired) {
      Logger.log(
        `====> Previous Session is expired. Creating new session for user ${companyUserId}`,
      );
      await this.userSessionsService.createNewSession(
        companyUserId,
        ipAddress,
        new Date(),
      );

      return;
    }

    if (!fetchUserSession.SessionEnd) return;

    //if the difference from the last session ended is 10 minutes or more we start a new session
    const deltaTime =
      (new Date().getTime() - fetchUserSession.SessionEnd.getTime()) / 60000; //divide the time value by 60000 milliseconds to minutes
    const sessionExpiredTimer = Number(process.env.SESSION_EXPIRED_TIMER) || 10;

    if (deltaTime >= sessionExpiredTimer) {
      Logger.log(
        `====>Previous session is expired due to timer, Updating old and Creating new session for user ${companyUserId}`,
      );
      await this.userSessionsService.updateSessionExpired(
        fetchUserSession.UserSessionID,
        true,
      );
      await this.userSessionsService.createNewSession(
        companyUserId,
        ipAddress,
        new Date(),
      );
      return;
    }

    if (fetchUserSession.SessionIP !== ipAddress) {
      await this.userSessionsService.updateSessionExpired(
        fetchUserSession.UserSessionID,
        true,
      );
      await this.userSessionsService.createNewSession(
        companyUserId,
        ipAddress,
        new Date(),
      );
    }

    Logger.log(
      `====> Reviving Previous session because it is not expired ${fetchUserSession.UserSessionID}`,
    );
    await this.userSessionsService.updateSessionEnd(companyUserId, null);
  }

  @SubscribeMessage('user-inactive')
  async handleUserInactive(client: Socket) {
    const companyUserId =
      this.websocketGateway.decodedToken(client).companyUserId;
    Logger.log(`====> User Inactive ${companyUserId}. Ending Session`);
    await this.userSessionsService.updateSessionEnd(
      companyUserId,
      new Date(),
      true,
    );
  }
}
