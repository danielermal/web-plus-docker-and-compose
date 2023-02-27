import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  getWishById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  getWishesLast() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  getWishesTop() {
    return this.findMany({ order: { copied: 'DESC' }, take: 10 });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете изменять подарки, созданные не вами',
      );
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.findOne({ where: { id: wishId } });

    const { id, name, description, image, link, price, copied } = wish;

    const userWish = await this.findOne({
      where: {
        name,
        price,
        link,
        owner: { id: userId },
      },
      relations: { owner: true },
    });

    if (userWish) {
      throw new ForbiddenException('"Этот подарок у вас уже есть"');
    }

    const newUserWish = {
      name,
      description,
      price,
      link,
      image,
      owner: { id: userId },
    };

    await this.wishesRepository.update(id, { copied: copied + 1 });
    await this.wishesRepository.save(newUserWish);

    return newUserWish;
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете удалять подарки, созданные не вами',
      );
    }

    this.wishesRepository.delete(id);
    return wish;
  }
}
