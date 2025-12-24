import { Injectable } from '@nestjs/common';
import { url } from 'inspector';

@Injectable()
export class HomeService {
  async welcome() {
    return { 
      message: 'Welcome to the WhatsApp API Service',
      url: process.env.APP_URL || 'http://localhost:6845',    
    };
  }
}
