import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@/user/user.service';
import User from '@/user/entities/user.entity';
import { config } from '@/base/config';

import { LoginDto } from './dtos/login.dto';
import Authenticate from './entities/auth.entity';
import {
  IJWTPayload,
  ITokens,
  LoginDetector,
  LoginStatus,
  LoginTracking,
} from './auth.constant';

import { DetectResult } from 'node-device-detector';
const DeviceDetector = require('node-device-detector');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authenticate)
    private readonly repository: Repository<Authenticate>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(user: User): Promise<ITokens> {
    const payload: IJWTPayload = {
      sub: user.id,
    };

    const access_token: string = this.jwtService.sign(payload);

    const refreshToken: string = this.jwtService.sign(payload, {
      secret: config.JWT_RT_SECRET,
      expiresIn: '30d',
    });

    return {
      access_token,
      refresh_token: refreshToken,
    };
  }

  async tracking({
    user,
    result,
    status,
    detector,
  }: LoginTracking): Promise<Authenticate> {
    if (!user) return null;

    const now = new Date();

    const { ip, headers } = detector;
    const track = new Authenticate();

    const agent: string = headers?.['user-agent'];
    let title: string = agent;
    let isMobile: boolean = false;

    try {
      const parse = JSON.parse(agent);
      if (parse) title = parse?.model;

      isMobile = true;
    } catch (error) {}

    if (!isMobile) {
      const detectorHelper = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });

      const deviceInfo: DetectResult = detectorHelper.detect(agent);

      if (deviceInfo && !title.includes('Dart')) {
        title = `${deviceInfo.client.name} - ${
          deviceInfo.device.model || deviceInfo.device.type
        }`;
      }
    }

    track.ip = ip;
    track.agent = agent;
    track.title = title;
    track.access_token = result?.access_token;
    track.refresh_token = result?.refresh_token;
    track.status = status;
    track.user = user;

    user.last_login = now;

    const results: [Authenticate, User] = await Promise.all([
      this.repository.save(track),
      user.save(),
    ]);

    return results[0];
  }

  async login(
    { username, password }: LoginDto,
    detector: LoginDetector,
    i18n: I18nContext,
  ): Promise<ITokens> {
    let user: User;
    let result: ITokens;
    let status: LoginStatus = LoginStatus.FAILED;

    try {
      user = await this.userService.getUserForLogin(
        { username, password },
        i18n,
      );

      result = await this.generateToken(user);
      status = LoginStatus.SUCCEED;
    } catch (error) {
      throw error;
    } finally {
      if (status === LoginStatus.SUCCEED) {
        await this.tracking({ user, status, result, detector });
      }

      if (status === LoginStatus.FAILED) {
        this.tracking({ user, status, result, detector });
      }
    }

    return result;
  }
}
