import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { FirstWhatsappApiLogDto } from './dto/FirstWhatsappApiLog.dto';

@Injectable()
export class AccessCodeService {
  private readonly logger = new Logger(AccessCodeService.name);
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

  async saveFirstMessagesLog(
    dto: FirstWhatsappApiLogDto,
  ): Promise<{ message: string }> {
    const query = `
      INSERT INTO whatsapp_api
      ("uniqueid", "phone_number", "file_location", "debtor_name", "debtor_month", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const parameter = [
      dto.uniqueId,
      dto.phone_number,
      dto.file_location,
      dto.debtor_name,
      dto.debtor_month,
      dto.createdAt ?? new Date(),
      dto.updatedAt ?? new Date(),
    ];

    console.log('PARAMETER INSERT:', parameter);

    try {
      await this.postgresService.query(query, parameter);

      return {
        message: 'Berhasil menyimpan whatsapp_api log',
      };
    } catch (error) {
      // 🔥 PENTING: log error ASLI
      this.logger.error(
        'Error saving first whatsapp api log',
        error.stack ?? error.message,
      );

      // ❗ jangan throw kalau ini NON-BLOCKING
      return {
        message: 'Gagal menyimpan whatsapp_api log (logged)',
      };
    }
  }

  async webhooksMessagesLog(uniqueId: string, whatsappId: string) {
    const query = `
      UPDATE whatsapp_api
      SET "whatsapp_id" = $1, "updatedAt" = $2
      WHERE "uniqueid" = $3
      RETURNING id
    `;

    const parameter = [
      whatsappId,
      new Date(),
      uniqueId,
    ];

    try {
      const result = await this.postgresService.query(query, parameter);

      if (!result || result.length === 0) {
        return null; // ⬅️ JANGAN throw
      }

      return result[0]; // { id }
    } catch (error) {
      // log boleh, throw jangan
      this.logger.error(
        `DB error updating whatsapp_id (uniqueId=${uniqueId})`,
        error.stack,
      );

      return null;
    }
  }

  async workerMessagesLog(whatsappId: string, status: string, detailMessage: string) {
    const query = `
      UPDATE whatsapp_api
      SET "status" = $1, "json_data" = $2, "updatedAt" = $3
      WHERE "whatsapp_id" = $4
      RETURNING id
    `;

    const parameter = [
      status,
      detailMessage,
      new Date(),
      whatsappId,
    ];


    try {
      const result = await this.postgresService.query(query, parameter);

      if (!result || result.length === 0) {
        return null; // ⬅️ JANGAN throw
      }
      
      return result[0]; // { id }
    } catch (error) {
      // log boleh, throw jangan
      this.logger.error(
        `DB error updating worker messages log (whatsappId=${whatsappId})`,
        error.stack,
      );

      return null;
    }
  }
}