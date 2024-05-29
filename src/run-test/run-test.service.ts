import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { SeedDto } from '../share/seed.dto';
import { Log } from '../log/log.entity';

@Injectable()
export class RunTestService {
  private seedsDto: SeedDto[] = [
    {
      name: 'Log',
      repository: this.logRepository,
      jsonSeed: './src/run-test/seed/log.seed.json',
    },
    {
      name: 'Company',
      repository: this.companyRepository,
      jsonSeed: './src/run-test/seed/company.seed.json',
    },
    {
      name: 'User',
      repository: this.userRepository,
      jsonSeed: './src/run-test/seed/user.seed.json',
    },
  ];

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSeed(seeds: string[]): Promise<any> {
    for (const seed of this.seedsDto) {
      if (seeds.includes(seed.name)) {
        const data = JSON.parse(
          fs.readFileSync(path.resolve(seed.jsonSeed), 'utf-8'),
        );
        await seed.repository.save(data);
      }
    }
  }

  async clearDatabase(): Promise<any> {
    for (const seed of this.seedsDto) {
      await seed.repository.clear();
    }
  }
}
