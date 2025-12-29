import { Injectable } from '@nestjs/common';
import { ReceiveDto } from './dto/receive.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ReceiveService {
  constructor(private readonly httpService: HttpService) {}

  async dataReceive(receiveDto: ReceiveDto) {
    let link = '';

    if (receiveDto.environment === 'sandbox') {
      link = 'https://cdnstg.property365.co.id:4422/gpuat/invoice/';
    } else {
      link = 'https://cdn.property365.co.id:4422/gplive/invoice/';
    }
    
    const payload = {
      channel: 'wa',
      sender: '6287853653777',
      recipient: receiveDto.phone_number,
      type: 'template',
      template: {
        name: 'tagihan_2025',
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

    // return payload;

    const response = await firstValueFrom(
      this.httpService.post(
        'https://api-multichannel.aptana.co.id/api/v1/messages',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Api-Token': 'bab257c07bc69934abeabcc6ae184aa3',
          },
        },
      ),
    );

    return response.data;
  }
}