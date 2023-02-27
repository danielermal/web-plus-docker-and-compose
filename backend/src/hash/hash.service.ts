import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async generate(password: string) {
    const hashPass = await bcrypt.hash(
      password,
      this.configService.get('saltRound'),
    );
    return hashPass;
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
