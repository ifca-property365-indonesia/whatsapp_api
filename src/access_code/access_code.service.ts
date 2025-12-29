import { Injectable, NotFoundException } from "@nestjs/common";
import { PostgresService } from "../database/postgres.service";

@Injectable()
export class AccessCodeService {
  constructor(
    private readonly PostgresService: PostgresService,
  ) {}

  async findByCode(code: string) {
    const query = `
    SELECT * FROM company_access WHERE code = $1`;
    const result = await this.PostgresService.query(query);
    if (result.length === 0) {
      throw new NotFoundException('Access code not found');
    }
    return result[0];
  }
}