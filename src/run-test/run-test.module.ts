import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { CompanyUser } from '../company/company-user.entity';
import { CompanySetting } from '../company/company-setting.entity';
import { UserSetting } from '../user/user-setting.entity';
import { Log } from '../log/log.entity';
const entities = [Company, CompanyUser, CompanySetting, Log, User, UserSetting];
export const RunTestModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: entities,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
