import { ApiProperty } from '@nestjs/swagger';

export class ReceiveDto {
  @ApiProperty({ example: 'PT. IFCA Property365 Indonesia' })
  debtor_name: string;

  @ApiProperty({ example: 'November 2025' })
  debtor_month: string;

  @ApiProperty({ example: '28-12-PM00000346-IV24040292.pdf' })
  file_name: string;

  @ApiProperty({ example: '6281295150532' })
  wa_number: string;

  @ApiProperty({ example: 'sandbox' })
  environment: string;
}
