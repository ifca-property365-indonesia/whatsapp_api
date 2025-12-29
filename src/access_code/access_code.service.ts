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

  async saveFirstMessagesLog( firstWhatsappApiLogDto: FirstWhatsappApiLogDto) {
    const query = `
      INSERT INTO whatsapp_api
      (uniqueid, phone_number, file_location, debtor_name, debtor_month, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const parameter = [
      firstWhatsappApiLogDto.uniqueId,
      firstWhatsappApiLogDto.phone_number,
      firstWhatsappApiLogDto.file_location,
      firstWhatsappApiLogDto.debtor_name,
      firstWhatsappApiLogDto.debtor_month,
      firstWhatsappApiLogDto.createdAt ?? new Date(),
      firstWhatsappApiLogDto.updatedAt ?? new Date(),
    ];

    try {
      const result = await this.postgresService.query(query, parameter);

      if (!result || result.length === 0) {
        throw new InternalServerErrorException(
          'Failed to insert whatsapp_api log',
        );
      }

      return result[0]; // { id: number }
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error saving first whatsapp api log',
        detail: error.message,
      });
    }
  }

  async webhooksMessagesLog(uniqueId: string, whatsappId: string) {
    const query = `
      UPDATE whatsapp_api
      SET whatsapp_id = $1, updatedAt = $2
      WHERE uniqueid = $3
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
      SET status = $1, json_data = $2, updatedAt = $3
      WHERE whatsapp_id = $4
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