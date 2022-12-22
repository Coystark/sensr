import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password?: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    // Passport strategy will call this method with only the email
    if (!password) {
      return user;
    }

    if (!bcrypt.compareSync(password, user.passwordHash)) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    return user;
  }

  async signUp(signUpDto: SignUpDto) {
    const alreadyExists = await this.userRepo.findOne({
      where: { email: signUpDto.email },
    });

    if (alreadyExists) {
      throw new UnauthorizedException(
        'E-mail já foi registrado. Por favor, forneça um email diferente',
      );
    }

    const user = new User();

    const passwordHash = this.generatePasswordHash(signUpDto.password);

    user.passwordHash = passwordHash;
    user.email = signUpDto.email;
    user.name = signUpDto.name;

    return user.save();
  }

  generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  generatePasswordHash(password: string) {
    console.log('password', password);
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return passwordHash;
  }
}
