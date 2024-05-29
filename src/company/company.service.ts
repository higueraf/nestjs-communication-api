import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, IsNull } from 'typeorm';
import { Company } from './company.entity';
import { ListResponseDto } from '../share/dto/list-response.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Company> = {
      skip,
      take: limit,
    };
    options.where = {
      DeletedBy: IsNull(),
    };
    if (search) {
      options.where.Name = Like(`%${search}%`);
    }
    const [data, totalCount] =
      await this.companyRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  findOne(CompanyID: string): Promise<Company> {
    return this.companyRepository.findOne({ where: { CompanyID: CompanyID } });
  }

  countCompanies(): Promise<number> {
    return this.companyRepository.count();
  }
}
