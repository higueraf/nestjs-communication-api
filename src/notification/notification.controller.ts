import {
  Controller,
  Get,
  Body,
  Request,
  Put,
  UseGuards,
  Query,
  ParseIntPipe,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateManuNotificationDto } from './dtos/update-many-notification.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ListResponseDto } from 'src/share/dto/list-response.dto';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { LogCreateDto } from 'src/log/dto/log-create.dto';
import { RoleEnum } from 'src/share/enum/role.enum';
import { LogEvent } from 'src/log/log.entity';
import { LogService } from 'src/log/log.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logService: LogService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ROOT)
  @Get()
  async findAll(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<ListResponseDto> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.notificationService.findAll(page, limit);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
      throw new InternalServerErrorException(
        'An unexpected error occurred while listing notifications.',
      );
    }
  }

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      return this.notificationService.createNotification(createNotificationDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating notification',
      );
    }
  }

  @Put()
  async updateMany(
    @Body() updateManuNotificationDto: UpdateManuNotificationDto,
  ) {
    try {
      return await this.notificationService.updateMany(
        updateManuNotificationDto,
      );
    } catch (e) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating notifications.',
      );
    }
  }
}
