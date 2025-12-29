import { ApiProperty } from '@nestjs/swagger';

export class ReceiveDto {
  @ApiProperty({ example: 'PT. IFCA Property365 Indonesia' })
  debtor_name: string;

  @ApiProperty({ example: 'November 2025' })
  debtor_month: string;

  @ApiProperty({ example: 'data_invoice.pdf' })
  file_name: string;

  @ApiProperty({ example: '6281295150532' })
  phone_number: string;

  @ApiProperty({ example: 'sandbox' })
  environment: string;
}
