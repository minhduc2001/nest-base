import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

// APPS
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@/role/roles.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { Public } from '@/auth/decorator/public.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { ListUserDto } from './dtos/user.dto';
import { Permissions } from '@/role/permission.decorator';
import { PERMISSIONS } from '@shared/constants/permission.constant';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes()
  // @Public()
  @Get()
  // @Roles(ERole.Admin)
  @Permissions(PERMISSIONS.DELETE_USER)
  getAllUser(@Query() query: ListUserDto) {
    return this.userService.getAllUser(query);
  }
}
