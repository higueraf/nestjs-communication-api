import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { NotificationType } from './notification-type.entity';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { uuid } from 'uuidv4';
import { ListResponseDto } from 'src/share/dto/list-response.dto';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';
import { NotificationTypeEnum } from 'src/share/enum/notification-type.enum';

@Injectable()
export class NotificationTypeService {
  constructor(
    @InjectRepository(NotificationType)
    private readonly notificationTypeRepository: Repository<NotificationType>,
  ) {}
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<NotificationType> = {
      skip,
      take: limit,
    };
    options.where = {
      DeletedBy: IsNull(),
    };
    const [data, totalCount] =
      await this.notificationTypeRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(notificationTypeId: string): Promise<NotificationType> {
    return await this.notificationTypeRepository.findOne({
      where: { NotificationTypeID: notificationTypeId },
    });
  }
  async findByTypeAndName(
    notificationTypeEnum: NotificationTypeEnum,
    sendType: SendTypeEnum,
  ): Promise<NotificationType> {
    console.log(notificationTypeEnum, sendType);
    return await this.notificationTypeRepository.findOne({
      where: { Name: notificationTypeEnum, SendType: sendType },
    });
  }

  create(
    notificationType: NotificationType,
    payloadUserDto: PayloadUserDto,
  ): Promise<NotificationType> {
    notificationType.NotificationTypeID = uuid();
    notificationType.CreatedBy = payloadUserDto.uid;
    notificationType.CreatedAt = new Date();
    return this.notificationTypeRepository.save(notificationType);
  }
  async update(
    notificationTypeId: string,
    notificationType: Partial<NotificationType>,
  ): Promise<NotificationType> {
    const updatedNotificationType: Partial<NotificationType> = {
      ...notificationType,
    };
    await this.notificationTypeRepository.update(
      notificationTypeId,
      updatedNotificationType,
    );
    return await this.notificationTypeRepository.findOne({
      where: { NotificationTypeID: notificationTypeId },
    });
  }

  async delete(
    notificationTypeId: string,
    payloadUserDto: PayloadUserDto,
  ): Promise<void> {
    const notificationType: NotificationType =
      await this.notificationTypeRepository.findOne({
        where: { NotificationTypeID: notificationTypeId },
      });
    notificationType.DeletedBy = payloadUserDto.uid;
    notificationType.DeletedAt = new Date();
    await this.notificationTypeRepository.save(notificationType);
  }
}
