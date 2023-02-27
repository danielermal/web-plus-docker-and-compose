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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RequestUser } from 'src/auth/auth.controller';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: RequestUser,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  getAllWishlists() {
    return this.wishlistsService.getAllWishlists();
  }

  @Get(':id')
  getWishListById(@Param('id') id: string) {
    return this.wishlistsService.getWishListById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestUser,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestUser) {
    return this.wishlistsService.delete(+id, req.user.id);
  }
}
