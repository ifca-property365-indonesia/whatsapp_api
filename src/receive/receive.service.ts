import { Injectable } from '@nestjs/common';
import { ReceiveDto } from './dto/receive.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AccessCodeService } from '../access_code/access_code.service';
import { channel } from 'diagnostics_channel';
import { send } from 'process';

@Injectable()
export class ReceiveService {
  constructor(
    private readonly httpService: HttpService,
    private readonly accessCodeService: AccessCodeService
  ) {}

  async dataReceive(receiveDto: ReceiveDto) {
    let link = '';

    if (receiveDto.environment === 'sandbox') {
      link = 'https://cdnstg.property365.co.id:4422/gpuat/invoice/';
    } else {
      link = 'https://cdn.property365.co.id:4422/gplive/invoice/';
    }

    const accessCodeData = await this.accessCodeService.findByCode(
      'GPPLAZA',
    );

    const payload = {
      channel: 'wa',
      sender: accessCodeData.sender,
      recipient: receiveDto.phone_number,
      type: 'template',
      template: {
        name: accessCodeData.template,
        language: {
          code: 'id',
        },
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

    return response;
    // return response.data;
  }
}