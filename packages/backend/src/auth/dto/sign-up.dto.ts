import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Email inválido' })
  @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'A senha deve conter no mínimo 6 caracteres',
  })
  password: string;

  @IsNotEmpty()
  name: string;
}
