import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FirstWhatsappApiLogDto {
  @IsNotEmpty()
  @IsString()
  uniqueId: string;

  @IsOptional()
  @IsString()
  debtor_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  file_location?: string;

  @IsOptional()
  @IsString()
  debtor_month?: string;

  @IsOptional()
  @IsString()
  whatsapp_id?: string;

  @IsOptional()
  @IsString()
  json_data?: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString() 
  access_code?: string;
}
