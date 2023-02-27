import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, Length, IsUrl, IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(2, 30)
  @IsString()
  username: string;

  @IsOptional()
  @Length(2, 200)
  @IsString()
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
