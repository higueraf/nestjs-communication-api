import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CompanyUser } from '../company/company-user.entity';

@Entity({ name: 'UserSession' })
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  UserSessionID: string;

  @Column('uuid')
  CompanyUserID: string;

  @Column()
  SessionStart: Date;

  @Column()
  SessionEnd: Date;

  @Column()
  SessionIP: string;

  @Column()
  Expired: boolean;

  @ManyToOne(() => CompanyUser, (companyUser) => companyUser.userSettings)
  @JoinColumn({ name: 'CompanyUserID' })
  companyUser: CompanyUser;
}
