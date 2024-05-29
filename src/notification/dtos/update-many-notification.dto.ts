import {
  IsArray,
  ArrayMinSize,
  IsBoolean,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateManuNotificationDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one notificationsId is required' })
  @ArrayNotEmpty({ message: 'notificationsId array cannot be empty' })
  @IsString({
    each: true,
    message: 'Each element of notificationsId must be a string',
  })
  notificationsId: string[];

  @IsBoolean({ message: 'isRead must be a boolean' })
  isRead: boolean;
}
