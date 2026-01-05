import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadGatewayException,
  HttpException,  HttpStatus,
} from '@nestjs/common';
import { ReceiveDto } from './dto/receive.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AccessCodeService } from '../access_code/access_code.service';
import { retry } from '../common/utils/retry.util';


@Injectable()
export class ReceiveService {
  private readonly logger = new Logger(ReceiveService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly accessCodeService: AccessCodeService,
  ) {}

  async dataReceive(receiveDto: ReceiveDto) {
    /* ===============================
    * 1. SET LINK
    * =============================== */
    const link =
      receiveDto.environment === 'sandbox'
        ? 'https://cdnstg.property365.co.id:4422/gpuat/invoice/'
        : 'https://cdn.property365.co.id:4422/gplive/invoice/';

    /* ===============================
    * 2. GET ACCESS CODE (DB)
    * =============================== */
    const accessCodeData = await this.accessCodeService.findByCode('GPPLAZA');

    /* ===============================
    * 3–4. SEND WA API
    * =============================== */
    console.log('DATAreceiveDto:', receiveDto);
    console.log('Wa:', receiveDto.wa_number);
    const payload = {
      channel: 'wa',
      sender: accessCodeData.sender,
      recipient: receiveDto.wa_number,
      type: 'template',
      template: {
        name: accessCodeData.template,
        language: { code: 'id' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'document',
                document: {
                  link: `${link}${receiveDto.file_name}`,
                  filename: receiveDto.file_name,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: receiveDto.debtor_name },
              { type: 'text', text: receiveDto.debtor_month },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(
        'https://api-multichannel.aptana.co.id/api/v1/messages',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Api-Token': accessCodeData.client_secret,
          },
        },
      ),
    );

    const apiResult = response.data;

    if (!apiResult?.data?.uniqueId) {
      throw new Error('Invalid WA API response');
    }

    /* ===============================
    * 5. SAVE LOG (NON-BLOCKING + RETRY)
    * =============================== */
    retry(
      () =>
        this.accessCodeService.saveFirstMessagesLog({
          uniqueId: apiResult.data.uniqueId,
          phone_number: receiveDto.wa_number,
          file_location: `${link}${receiveDto.file_name}`,
          debtor_name: receiveDto.debtor_name,
          debtor_month: receiveDto.debtor_month,
        }),
      3,
      2000,
    ).catch((error) => {
      this.logger.error(
        'Failed to save WhatsApp log after retries',
        error.stack,
      );
    });

    /* ===============================
    * 6. RETURN SUCCESS (TANPA NUNGGU LOG)
    * =============================== */
    return {
      success: true,
      statusCode: 200,
      message: 'WhatsApp message sent successfully to Provider',
      whatsapp: {
        uniqueId: apiResult.data.uniqueId,
      },
    };
  }

  async webhooks(data: Record<string, any>) {
    this.logger.log('Webhook received', data);

    const uniqueId = data?.uniqueId;
    const sourceId = data?.sourceId;

    /* ===============================
    * 1. VALIDASI PAYLOAD
    * =============================== */
    if (!uniqueId || !sourceId) {
      this.logger.warn('Invalid webhook payload', data);

      // Tetap balikin 200 supaya provider tidak retry
      return {
        statusCode: HttpStatus.OK,
        message: 'Webhook ignored (invalid payload)',
      };
    }

    /* ===============================
    * 2. UPDATE DB (NON-BLOCKING)
    * =============================== */
    try {
      const result = await this.accessCodeService.webhooksMessagesLog(
        uniqueId,
        sourceId,
      );

      // executeRaw biasanya return number of affected rows
      if (!result) {
        this.logger.warn(
          `Webhook received but no row updated (uniqueId=${uniqueId})`,
        );
      }
    } catch (error) {
      // ❗ PENTING: jangan throw 500
      this.logger.error(
        'Unexpected error in webhook',
        error.stack,
      );
    }

    /* ===============================
    * 3. ALWAYS RETURN 200
    * =============================== */
    return {
      statusCode: HttpStatus.OK,
      message: 'Webhook processed',
    };
  }

  async worker(data: Record<string, any>) {
    this.logger.log('Worker received', data);
    const whatsappId =
      data.payload.entry?.[0].changes?.[0].value.statuses?.[0].id || null;
    const status =
      data.payload.entry?.[0].changes?.[0].value.statuses?.[0].status || null;
    const detailMessage = data.payload || null;

    try {
      const result = await this.accessCodeService.workerMessagesLog(
        whatsappId,
        status,
        detailMessage
      );

      // executeRaw biasanya return number of affected rows
      if (!result) {
        this.logger.warn(
          `Worker received but no row updated (whatsappId=${whatsappId})`,
        );
      }
    } catch (error) {
      // ❗ PENTING: jangan throw 500
      this.logger.error(
        'Unexpected error in Worker',
        error.stack,
      );
    }

    /* ===============================
    * 3. ALWAYS RETURN 200
    * =============================== */
    return {
      statusCode: HttpStatus.OK,
      message: 'Worker processed',
    };
  }
}