import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseLogger from './database-logger';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          logger: new DatabaseLogger(),
          host: configService.get('RDS_HOSTNAME'),
          port: +configService.get('RDS_PORT') || 5432,
          username: configService.get('RDS_USERNAME'),
          password: configService.get('RDS_PASSWORD'),
          database: configService.get('RDS_DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          useUTC: true,
          synchronize: true,
          ssl: false,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
