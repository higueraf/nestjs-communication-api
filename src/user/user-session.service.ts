import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from './user-session.entity';
import { uuid } from 'uuidv4';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly usersSessionsRepository: Repository<UserSession>,
  ) {}

  findOne(id: string): Promise<UserSession> {
    return this.usersSessionsRepository.findOneBy({ UserSessionID: id });
  }

  async getSessionByUserId(userId: string): Promise<UserSession | null> {
    return await this.usersSessionsRepository
      .createQueryBuilder('userSessions')
      .where('userSessions.UserID = :userId', { userId })
      .orderBy('userSessions.sessionStart', 'DESC')
      .getOne();
  }

  async createNewSession(
    companyUserId: string,
    userIP: any,
    datetimeStart: Date,
  ): Promise<UserSession | null> {
    const newSession = new UserSession();
    newSession.UserSessionID = uuid();
    newSession.SessionStart = datetimeStart;
    newSession.SessionIP = userIP;
    newSession.CompanyUserID = companyUserId;

    return await this.usersSessionsRepository.save(newSession);
  }

  async updateSessionExpired(
    sessionId: string,
    expired: boolean,
  ): Promise<UserSession | null> {
    const userSession = await this.usersSessionsRepository.findOne({
      where: { UserSessionID: sessionId },
    });

    if (!userSession) return null;

    userSession.Expired = expired;

    return await this.usersSessionsRepository.save(userSession);
  }

  async updateSessionEnd(
    companyUserId: string,
    datetimeEnd: Date | null,
    expired: boolean = false,
  ): Promise<UserSession | null> {
    const userSession = await this.usersSessionsRepository
      .createQueryBuilder('userSessions')
      .where('userSessions.CompanyUserID = :companyUserId', { companyUserId })
      .orderBy('userSessions.sessionStart', 'DESC')
      .getOne();

    if (!userSession) return null;

    if (userSession.Expired) return null;

    userSession.SessionEnd = datetimeEnd;
    if (expired) userSession.Expired = expired;

    return await this.usersSessionsRepository.save(userSession);
  }
}
