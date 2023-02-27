import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    const user = await this.findOne({ where: [{ email }, { username }] });

    if (user) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hash = await this.hashService.generate(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password, email } = updateUserDto;
    const userData = await this.findOne({ where: [{ email }, { username }] });

    if (userData.id !== id) {
      throw new ConflictException(
        'Пользователь с такими данными уже зарегестрирован',
      );
    }

    if (password) {
      updateUserDto.password = await this.hashService.generate(password);
    }

    const user = await this.findOne({ where: { id } });

    await this.userRepository.update(id, { ...user, ...updateUserDto });

    return this.findOne({ where: { id } });
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }

  getByUsername(username: string) {
    return this.findOne({
      where: { username },
    });
  }

  getMyWishes(userId: number) {
    return this.findOne({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    }).then((user) => user.wishes);
  }

  getAnotherUserWishes(username: string) {
    return this.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    }).then((user) => user.wishes);
  }

  findByEmailOrName(query: string) {
    return this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }
}
