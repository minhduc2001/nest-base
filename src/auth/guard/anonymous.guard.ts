import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AnonymousAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  /**
   * Handle error code if canActivate return false
   *
   * @param {*} error null
   * @param {*} user
   * @param {*} info | TokenExpiredError | JsonWebTokenError
   * @returns
   * @memberof RolesGuard
   */
  handleRequest(error, user, info) {
    // You can throw an exception based on either "info" or "error" arguments
    if (error && !user) {
      throw error || new UnauthorizedException();
    }

    return user;
  }
}
