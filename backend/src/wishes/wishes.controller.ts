import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/jwt.guard';
import { RequestUser } from 'src/auth/auth.controller';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestUser) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getWishesLast();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getWishesTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.getWishById(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: RequestUser,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestUser) {
    return this.wishesService.remove(+id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') wishId: string, @Req() req: RequestUser) {
    return this.wishesService.copy(+wishId, req.user.id);
  }
}
