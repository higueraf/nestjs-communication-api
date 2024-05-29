import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Notification } from './notification.entity';

@Entity({ name: 'NotificationType' })
export class NotificationType {
  @PrimaryGeneratedColumn('uuid')
  NotificationTypeID: string;

  @Column()
  SendType: string;

  @Column()
  Name: string;

  @Column()
  Title: string;

  @Column()
  Message: string;

  @Column()
  SecondaryMessage: string;

  @Column()
  Description: string;

  @Column()
  Icon: string;

  @Column()
  Target: string;

  @Column()
  HideLink: string;

  @Column()
  LinkUrl: string;

  @Column()
  LinkText: string;

  @Column()
  ImageUrl: string;

  @Column({ type: 'uuid' })
  CreatedBy: string;

  @Column()
  CreatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy: string;

  @Column({ nullable: true })
  DeletedAt: Date;

  @OneToMany(
    () => Notification,
    (notification) => notification.notificationType,
  )
  notifications: Notification[];
}
