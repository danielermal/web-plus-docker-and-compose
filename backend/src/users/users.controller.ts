import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RequestUser } from 'src/auth/auth.controller';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMy(@Req() req: RequestUser) {
    return req.user;
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: RequestUser) {
    return this.usersService.getMyWishes(req.user.id);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getAnotherUserWishes(username);
  }

  @Patch('me')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: RequestUser) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  findByEmailOrName(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findByEmailOrName(query);
  }
}
