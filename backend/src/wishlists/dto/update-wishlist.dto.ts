import { IsOptional, Length, IsUrl, IsString } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: number[];
}
