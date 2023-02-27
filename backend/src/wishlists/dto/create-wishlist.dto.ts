import { Length, IsUrl, IsString } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  itemsId: number[];
}
