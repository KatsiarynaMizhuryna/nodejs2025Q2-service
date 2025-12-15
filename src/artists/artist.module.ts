import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from 'src/albums/album.module';
import { TrackModule } from 'src/tracks/track.module';

@Module({
  controllers: [ArtistController],
  imports: [AlbumModule, TrackModule],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
