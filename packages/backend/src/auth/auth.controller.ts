import { User } from 'src/users/entities/user.entity';
import { Controller, Post, UseGuards, Req, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @UseGuards(AuthGuard('local'))
  async signIn(
    @Req() req: Request & { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = new User(req.user);

    const token = this.authService.generateToken(user);

    res.cookie('accessToken', token, {
      httpOnly: true,
    });

    return {
      user,
      accessToken: token,
    };
  }

  @Public()
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    const user = await this.authService.signUp(signUpDto);

    const token = this.authService.generateToken(user);

    res.cookie('accessToken', token, {
      httpOnly: true,
    });

    return {
      user,
      accessToken: token,
    };
  }
}
