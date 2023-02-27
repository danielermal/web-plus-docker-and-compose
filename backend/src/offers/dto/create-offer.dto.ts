import { Min, IsOptional, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  @IsNumber()
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
