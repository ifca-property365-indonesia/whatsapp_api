import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { MssqlService } from './mssqlserver.service';

@Module({
  providers: [PostgresService, MssqlService],
  exports: [PostgresService, MssqlService],
})
export class DatabaseModule {}
