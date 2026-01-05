import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { MssqlService } from '../database/mssqlserver.service';
import { FirstWhatsappApiLogDto } from './dto/FirstWhatsappApiLog.dto';

@Injectable()
export class AccessCodeService {
  private readonly logger = new Logger(AccessCodeService.name);
  constructor(
    private readonly postgresService: PostgresService,
    private readonly MssqlService: MssqlService,
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
      ("uniqueid", "phone_number", "file_location", "debtor_name", "debtor_month", "createdAt", "updatedAt", "access_code")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const parameter = [
      dto.uniqueId,
      dto.phone_number,
      dto.file_location,
      dto.debtor_name,
      dto.debtor_month,
      dto.createdAt ?? new Date(),
      dto.updatedAt ?? new Date(),
      "GPPLAZA"
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
      UPDATE mgr.ar_whatsapp_inv_log_msg
      SET whatsapp_id = @whatsappId
      WHERE unique_id = @uniqueId
    `;

    try {
      const result = await this.MssqlService.query(query, {
        whatsappId,
        uniqueId,
      });

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `DB error updating whatsapp_id (uniqueId=${uniqueId})`,
        error.stack,
      );
      return null;
    }
  }

  async workerMessagesLog(
    whatsappId: string,
    status: string,
  ) {
    const query = `
      UPDATE mgr.ar_whatsapp_inv_log_msg
      SET
        status_code = @status,
        audit_date = GETDATE()
      WHERE whatsapp_id = @whatsappId
    `;

    try {
      const result = await this.MssqlService.query(query, {
        status,
        whatsappId,
      });

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `DB error updating worker messages log (whatsappId=${whatsappId})`,
        error.stack,
      );
      return null;
    }
  }
}