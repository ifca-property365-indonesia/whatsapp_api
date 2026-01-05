import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class MssqlService implements OnModuleDestroy {
  private pool: sql.ConnectionPool;

  constructor() {
    const config: sql.config = {
      user: process.env.DB_USER_MS,
      password: process.env.DB_PASSWORD_MS,
      database: process.env.DB_NAME_MS,
      server: process.env.DB_HOST_MS as string,
      port: Number(process.env.DB_PORT_MS),
      options: {
        encrypt: process.env.DB_SSL_MS === 'true',
        trustServerCertificate: false,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    this.pool = new sql.ConnectionPool(config);

    this.pool.connect().catch(err => {
      console.error('MSSQL connection failed:', err);
    });
  }

  /**
   * Generic query with named parameters
   */
  async query<T = any>(
    sqlQuery: string,
    params?: Record<string, any>,
  ): Promise<sql.IResult<T>> {
    const request = this.pool.request();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
    }

    return request.query<T>(sqlQuery);
  }

  async onModuleDestroy() {
    await this.pool.close();
  }
}