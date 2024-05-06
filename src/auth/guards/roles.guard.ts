import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const req = context.switchToHttp().getRequest();
    console.log(req.headers.authorization)
    if(!req?.headers?.authorization){
      throw new UnauthorizedException()
    }
    let tokenArray = req?.headers?.authorization.split(" ");
    let decodedToken:any = decode(tokenArray[1]);
    if(decodedToken?.role != "ADMIN"){
      throw new ForbiddenException('Only Admins can access this endpoint')
    }
    return true;
  }
}