import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiOperation, ApiTagsAndBearer } from '@/base/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ITokens } from './auth.constant';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTagsAndBearer('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login to service' })
  @Post('login')
  login(
    @Body() payload: LoginDto,
    @Ip() ip: string,
    @Headers() headers: Record<string, string>,
    @I18n() i18n: I18nContext,
  ): Promise<ITokens> {
    return this.authService.login(payload, { ip, headers }, i18n);
  }
}
