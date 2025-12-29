import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';

@Injectable()
export class AccessCodeService {
  constructor(
    private readonly postgresService: PostgresService,
  ) {}

  async findByCode(code: string) {
    const query = `
      SELECT
        *
      FROM company_access
      WHERE access_code = $1
      LIMIT 1
    `;
    console.log(query);
    const result = await this.postgresService.query(
      query,
      [code], // ✅ kirim parameter
    );
    if (result.length === 0) {
      throw new NotFoundException('Access code not found');
    }

    return result[0];
  }
}
