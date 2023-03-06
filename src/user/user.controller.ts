import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

// APPS
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@/role/roles.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { Public } from '@/auth/decorator/public.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { ListUserDto } from './dtos/user.dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes()
  @Public()
  @Get()
  // @Roles(ERole.Admin)
  getAllUser(@Query() query: ListUserDto) {
    return this.userService.getAllUser(query);
  }
}
