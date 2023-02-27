import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  create(createWishlistDto: CreateWishlistDto, ownerId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });
    return this.wishlistsRepository.save(wishList);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.find(query);
  }

  getWishListById(id: number) {
    return this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  getAllWishlists() {
    return this.findMany({
      relations: ['items', 'owner'],
    });
  }

  async update(id, updateWishlistDto: UpdateWishlistDto, userId: number) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужой список подарков',
      );
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const newWishlist = { ...wishlist, ...rest, items };

    await this.wishlistsRepository.save(newWishlist);
    return newWishlist;
  }

  async delete(id: number, userId) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете удалить чужой список подарков',
      );
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
