import { Injectable } from '@nestjs/common';
import { ReceiveDto } from './dto/receive.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AccessCodeService } from '../access_code/access_code.service';

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
      channel: accessCodeData.code,
      valid: accessCodeData.valid
    };

    return payload;
  }
}