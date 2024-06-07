import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { AnonymousAuthGuard } from '../guard/anonymous.guard';

export const ROLES_KEY = 'roles';

export const Auth = (...permisisons: string[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, permisisons),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};

export const AuthAnonymous = () => {
  return applyDecorators(
    UseGuards(AnonymousAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
