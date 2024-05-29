import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CompanyUser } from '../company/company-user.entity';
import { NotificationType } from './notification-type.entity';

@Entity({ name: 'Notification' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  NotificationID: string;

  @Column('uuid')
  CompanyUserID: string;

  @Column({ type: 'uuid', nullable: true })
  NotificationTypeID: string;

  @Column()
  SendType: string;

  @Column()
  Title: string;

  @Column()
  Message: string;

  @Column()
  SecondaryMessage: string;

  @Column()
  Target: string;

  @Column()
  HideLink: string;

  @Column()
  LinkUrl: string;

  @Column()
  ReadAt: Date;

  @Column({ type: 'uuid' })
  CreatedBy: string;

  @Column()
  CreatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy: string;

  @Column({ nullable: true })
  DeletedAt: Date;

  @ManyToOne(
    () => NotificationType,
    (notificationType) => notificationType.notifications,
  )
  @JoinColumn({
    name: 'NotificationTypeID',
    referencedColumnName: 'NotificationTypeID',
  })
  notificationType: NotificationType;

  @ManyToOne(() => CompanyUser, (companyUser) => companyUser.userSettings)
  @JoinColumn({ name: 'CompanyUserID', referencedColumnName: 'CompanyUserID' })
  companyUser: CompanyUser;
}
