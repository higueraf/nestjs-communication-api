import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { uuid } from 'uuidv4';
import { ListResponseDto } from 'src/share/dto/list-response.dto';
import { UpdateManuNotificationDto } from './dtos/update-many-notification.dto';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationTypeService } from './notification-type.service';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';
import { EmailService } from 'src/email/email.service';
import { EmailDataDto } from 'src/email/dto/email-data.dto';
import { EmitDataDto } from 'src/websocket/dto/emit-data.dto';
import { CommonWebsocketService } from 'src/websocket/common-websocket.service';
import { NotificationParametersDto } from './dtos/notification-parameters.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationTypeService: NotificationTypeService,
    private readonly emailService: EmailService,
    private readonly commonWebsocketService: CommonWebsocketService,
  ) {}
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Notification> = {
      skip,
      take: limit,
    };
    options.where = {
      DeletedBy: IsNull(),
    };
    const [data, totalCount] =
      await this.notificationRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(notificationId: string): Promise<Notification> {
    return await this.notificationRepository.findOne({
      where: { NotificationID: notificationId },
      relations: ['notificationType'],
    });
  }
  async create(notification: Partial<Notification>): Promise<Notification> {
    notification.NotificationID = uuid();
    notification.CreatedAt = new Date();
    await this.notificationRepository.save(notification);
    return await this.findOne(notification.NotificationID);
  }

  private replaceKeyValue(
    parameter: string,
    key: string,
    value: string,
  ): string {
    return parameter.replace('{{' + key + '}}', value);
  }
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<any> {
    for (const sendType of createNotificationDto.SendType) {
      const notificationType =
        await this.notificationTypeService.findByTypeAndName(
          createNotificationDto.NotificationType,
          sendType,
        );
      const parameters: NotificationParametersDto =
        new NotificationParametersDto();
      parameters.title = notificationType.Title;
      parameters.message = notificationType.Message;
      parameters.secondaryMessage = notificationType.SecondaryMessage;
      parameters.target = notificationType.Target;
      parameters.linkUrl = notificationType.LinkUrl;
      for (const parameter of createNotificationDto.Parameters) {
        for (const key in parameters) {
          if (Object.prototype.hasOwnProperty.call(parameters, key)) {
            const value = parameters[key];
            parameters[key] = this.replaceKeyValue(
              value,
              parameter.Key,
              parameter.Value,
            );
          }
        }
      }

      let notification: Notification = new Notification();
      notification.NotificationID = uuid();
      notification.CompanyUserID = createNotificationDto.CompanyUserID;
      notification.NotificationTypeID = notificationType.NotificationTypeID;
      notification.SendType = sendType;
      notification.Title = parameters.title;
      notification.Message = parameters.message;
      notification.SecondaryMessage = parameters.secondaryMessage;
      notification.Target = parameters.target;
      notification.LinkUrl = parameters.linkUrl;
      notification.CreatedBy = createNotificationDto.UserID;
      notification = await this.create(notification);
      notification = await this.findOne(notification.NotificationID);
      console.log(notification);
      switch (sendType) {
        case SendTypeEnum.EMAIL:
          this.handleEmail(createNotificationDto, notification);
          break;
        case SendTypeEnum.WEBSOCKET:
          this.handleWebsocket(createNotificationDto, notification);
          break;
      }
    }
  }
  async update(
    notificationId: string,
    notification: Partial<Notification>,
  ): Promise<Notification> {
    const updatedNotification: Partial<Notification> = {
      ...notification,
      ReadAt: new Date(),
    };
    await this.notificationRepository.update(
      notificationId,
      updatedNotification,
    );
    return await this.notificationRepository.findOne({
      where: { NotificationID: notificationId },
    });
  }
  async updateMany(
    updateManuNotificationDto: UpdateManuNotificationDto,
  ): Promise<void> {
    const { notificationsId, isRead } = updateManuNotificationDto;
    for (const notificationId of notificationsId) {
      await this.update(notificationId, {
        ReadAt: isRead ? new Date() : null,
      });
    }
  }

  async handleEmail(
    createNotificationDto: CreateNotificationDto,
    notification: Notification,
  ): Promise<void> {
    const emailData: EmailDataDto = new EmailDataDto();
    emailData.TITLE_MESSAGE = notification.Title;
    emailData.MAIN_MESSAGE = notification.Message;
    emailData.RECIPIENTS = createNotificationDto.Recipients.map(
      (recipient) => recipient.Email,
    ).join(', ');
    emailData.SECONDARY_MESSAGE = notification.SecondaryMessage;
    emailData.TARGET = notification.Target;
    emailData.LINK_URL = notification.LinkUrl;
    emailData.LINK_TEXT = notification.notificationType.LinkText;
    emailData.IMAGE_URL =
      process.env.BLOB_STORAGE_PROJECTS +
      notification.notificationType.ImageUrl;
    emailData.HIDE_LINK = notification.notificationType.HideLink;
    this.emailService.sendEmail(emailData);
  }
  async handleWebsocket(
    createNotificationDto: CreateNotificationDto,
    notification: Notification,
  ): Promise<void> {
    const emitDataDto: EmitDataDto = new EmitDataDto();
    emitDataDto.Title = notification.Title;
    emitDataDto.Message = notification.Message;
    emitDataDto.Icon = notification.notificationType.Icon;
    emitDataDto.Recipients = createNotificationDto.Recipients.map(
      (recipient) => recipient.CompanyUserID,
    );
    this.commonWebsocketService.Emit(emitDataDto);
  }
}
