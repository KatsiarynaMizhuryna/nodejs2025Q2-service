import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  duration: number;
}
