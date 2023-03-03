import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

// APPS
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { Public } from '@/auth/decorator/public.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes()
  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }
}
