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
        encrypt: process.env.DB_SSL_MS === 'true', // true untuk Azure
        trustServerCertificate: false, // untuk local / self-signed
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

  async query<T = any>(sqlQuery: string, params?: any[]): Promise<T[]> {
    const request = this.pool.request();

    // bind parameter secara positional (@p0, @p1, ...)
    if (params && params.length) {
      params.forEach((value, index) => {
        request.input(`p${index}`, value);
      });
    }

    const result = await request.query(sqlQuery);
    return result.recordset as T[];
  }

  async onModuleDestroy() {
    await this.pool.close();
  }
}
