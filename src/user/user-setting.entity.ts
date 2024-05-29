import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CompanyUser } from '../company/company-user.entity';

@Entity({ name: 'UserSetting' })
export class UserSetting {
  @PrimaryGeneratedColumn('uuid')
  UserSettingID: string;

  @Column('uuid')
  CompanyUserID: string;

  @Column('uuid')
  RoleID: string;

  @Column({ type: 'uuid', nullable: true })
  BranchDepartmentID: string;

  @Column()
  PhoneNumberConfirmed: boolean;

  @Column()
  EmailConfirmed: boolean;

  @Column()
  IsConnected: boolean;

  @Column()
  Token: string;

  @Column()
  Locked: boolean;

  @Column()
  AccessFailedDate: Date;

  @Column()
  DateJoined: Date;

  @Column()
  DateLastActive: Date;

  @Column()
  DateInvited: Date;

  @Column()
  Comments: string;

  @Column()
  CommentsDate: Date;

  @Column({ type: 'uuid' })
  CreatedBy: string;

  @Column()
  CreatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  UpdatedBy: string;

  @Column({ nullable: true })
  UpdatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  DeletedBy: string;

  @Column({ nullable: true })
  DeletedAt: Date;

  @ManyToOne(() => CompanyUser, (companyUser) => companyUser.userSettings)
  @JoinColumn({ name: 'CompanyUserID' })
  companyUser: CompanyUser;
}
