import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('signin')
    async signIn(@Body() signInDto: SignInDto) {
      return { token: await this.authService.signIn(signInDto) };
    }
}
