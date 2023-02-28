import { Injectable } from '@nestjs/common';

import * as exc from '@base/api/exception.reslover';

@Injectable()
export class AuthService {
  async register() {
    const a = 0;
    if (a === 0)
      throw new exc.BadRequest({
        message: 'haahahha',
        data: { a: 1545 },
        errorCode: '2515',
      });
    return 'a';
  }
}
