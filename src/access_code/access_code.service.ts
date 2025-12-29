import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { FirstWhatsappApiLogDto } from './dto/FirstWhatsappApiLog.dto';

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

  async saveFirstMessagesLog( FirstWhatsappApiLogDto: FirstWhatsappApiLogDto) {
    const query = `Insert Into whatsapp_api (uniqueid, phone_number, file_location, debtor_name, debtor_month, createdAt, updatedAt)
      Values ($1, $2, $3, $4, $5, $6, $7) returning id`;

    const parameter = [
      FirstWhatsappApiLogDto.uniqueId,
      FirstWhatsappApiLogDto.phone_number,
      FirstWhatsappApiLogDto.file_location,
      FirstWhatsappApiLogDto.debtor_name,
      FirstWhatsappApiLogDto.debtor_month,
      FirstWhatsappApiLogDto.createdAt,
      FirstWhatsappApiLogDto.updatedAt,
    ];

    const result = await this.postgresService.query(query, parameter);
    return result[0];
  }
}
