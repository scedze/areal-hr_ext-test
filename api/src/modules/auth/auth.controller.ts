import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    req.session.user = req.user;
    return {
      id: req.user.id,
      login: req.user.login,
      role: req.user.role,
      last_name: req.user.last_name,
      first_name: req.user.first_name,
    };
  }

  @Post('logout')
  async logout(@Request() req) {
    req.session.destroy();
    return { message: 'Logged out successfully' };
  }

  @Post('me')
  async me(@Request() req) {
    if (!req.session.user) {
      return { user: null };
    }
    return { user: req.session.user };
  }
}