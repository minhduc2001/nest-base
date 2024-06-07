import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// APPS
import { UserService } from '@/user/user.service';

// BASE
import { config } from '@/config';
import { IJWTPayload } from '../auth.constant';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: IJWTPayload,
    done: (err: Error, user: any) => void,
  ) {
    const user = await this.userService.getUserWithStrategy(
      payload.sub,
      request,
    );
    if (!user) throw new UnauthorizedException();

    done(null, user);
    return !!user;
  }
}
