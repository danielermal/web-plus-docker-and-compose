import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestUser } from 'src/auth/auth.controller';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestUser) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get(':id')
  getOfferById(@Param('id') id: string) {
    return this.offersService.getOfferById(Number(id));
  }

  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }
}
