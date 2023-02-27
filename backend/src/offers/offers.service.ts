import { ForbiddenException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const { id, price, owner, raised } = wish;

    if (owner.id === userId) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на подарки, принадлежащие вам',
      );
    }

    if (raised + amount > price) {
      throw new ForbiddenException(
        'Сумма вашего взноса превышает оставшуюся сумму',
      );
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.offerRepository.save(offer);
    await this.wishRepository.update(id, { raised: raised + amount });

    return offer;
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  getAllOffers() {
    return this.findMany({
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }

  getOfferById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }
}
