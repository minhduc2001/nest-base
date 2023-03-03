import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// APPS
import { UserService } from '@/user/user.service';
import { IJWTPayload } from '@/auth/interfaces/auth.interface';

// BASE
import * as exc from '@base/api/exception.reslover';
import { config } from '@/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  async validate(payload: IJWTPayload) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new exc.Unauthorized({ message: 'hsjdkajkhsd' });

    delete user.password;
    return user;
  }
}
