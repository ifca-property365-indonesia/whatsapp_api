import { ApiProperty } from '@nestjs/swagger';

export class ReminderDto {
  @ApiProperty({ example: '2260/PPPSRS/I/2026' })
  due_no: string;

  @ApiProperty({ example: '6281295150532' })
  wa_no: string;

  @ApiProperty({ example: '3OFF7-PM00000303-RM26010046.pdf' })
  file_name: string;

  @ApiProperty({ example: 'sandbox' })
  environment: string;
}
