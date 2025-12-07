import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from 'src/tracks/track.module';

@Module({
  controllers: [AlbumController],
  imports: [TrackModule],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
