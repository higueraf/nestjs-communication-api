import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Company } from './company/company.entity';
import { CompanyUser } from './company/company-user.entity';
import { User } from './user/user.entity';
import { CompanyModule } from './company/company.module';
import { ShareModule } from './share/share.module';
import { CompanyService } from './company/company.service';
import { UserSetting } from './user/user-setting.entity';
import { LogModule } from './log/log.module';
import { Log } from './log/log.entity';
import { WebsocketModule } from './websocket/websocket.module';
import { WebsocketService } from './websocket/websocket.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.MSSQL_HOST,
        port: parseInt(process.env.MSSQL_PORT, 10),
        username: process.env.MSSQL_USER,
        password: process.env.MSSQL_PASSWORD,
        database: process.env.MSSQL_DATABASE,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: false,
        migrationsRun: false,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    TypeOrmModule.forFeature([Company, CompanyUser, Log, User, UserSetting]),
    AuthModule,
    CompanyModule,
    LogModule,
    NotificationModule,
    ShareModule,
    UserModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, CompanyService, WebsocketService],
})
export class AppModule {}
