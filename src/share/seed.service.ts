import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../company/company.entity';

import { User } from '../user/user.entity';
import { SeedDto } from './seed.dto';

@Injectable()
export class SeedService {
  private seedsDto: SeedDto[] = [
    {
      name: 'User',
      repository: this.userRepository,
      jsonSeed: './src/share/seed/user.seed.json',
    },

    {
      name: 'Company',
      repository: this.companyRepository,
      jsonSeed: './src/share/seed/company.seed.json',
    },
  ];
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSeed(): Promise<void> {
    for (const seed of this.seedsDto) {
      console.log('seed.name', seed.name);
      const data = JSON.parse(
        fs.readFileSync(path.resolve(seed.jsonSeed), 'utf-8'),
      );
      console.log(data);
      await seed.repository.save(data);
    }
  }

  async clearDatabase(): Promise<void> {
    for (const seed of this.seedsDto) {
      await seed.repository.clear();
    }
  }
}
