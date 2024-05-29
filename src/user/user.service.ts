import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { uuid } from 'uuidv4';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<User> = {
      skip,
      take: limit,
    };
    options.where = {
      DeletedBy: IsNull(),
    };
    if (search) {
      options.where.Name = Like(`%${search}%`);
    }
    const [data, totalCount] = await this.userRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(userID: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { UserID: userID, DeletedBy: IsNull() },
    });
  }

  create(user: User, payloadUserDto: PayloadUserDto): Promise<User> {
    user.UserID = uuid();
    user.CreatedBy = payloadUserDto.uid;
    user.CreatedAt = new Date();
    return this.userRepository.save(user);
  }
  async update(
    userId: string,
    user: Partial<User>,
    payloadUserDto: PayloadUserDto,
  ): Promise<User> {
    const updatedBranch: Partial<User> = {
      ...user,
      UpdatedBy: payloadUserDto.uid,
      UpdatedAt: new Date(),
    };
    await this.userRepository.update(userId, updatedBranch);
    return await this.userRepository.findOne({
      where: { UserID: userId },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { Email: email },
      relations: [
        'companyUsers',
        'companyUsers.company',
        'companyUsers.userSettings',
        'companyUsers.userSettings.role',
      ],
    });
  }

  async findByFilter(filter: any) {
    return await this.userRepository.findOneBy(filter);
  }
  async delete(roleId: string, user: string): Promise<void> {
    const role: User = await this.userRepository.findOne({
      where: { UserID: roleId },
    });
    role.DeletedBy = user;
    role.DeletedAt = new Date();
    await this.userRepository.save(role);
  }
}
