import { Length, Min, IsUrl, IsString, IsNumber } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @Min(1)
  @IsNumber()
  price: number;

  @Length(1, 1024)
  @IsString()
  description: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;
}
