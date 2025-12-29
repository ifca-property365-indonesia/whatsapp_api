import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessCodeService {
  async findByCode(code: string) {
    // contoh query DB (typeorm / prisma / raw)
    return { 
      code, 
      valid: true 
    };
  }
}
