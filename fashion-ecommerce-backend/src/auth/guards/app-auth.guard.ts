import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AppAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('AppAuthGuard - isPublic:', isPublic);
    console.log('AppAuthGuard - endpoint:', context.getHandler().name);

    if (isPublic) {
      console.log('AppAuthGuard - allowing public access');
      return true;
    }

    console.log('AppAuthGuard - requiring authentication');
    return super.canActivate(context);
  }
} 