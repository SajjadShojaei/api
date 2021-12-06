import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleTag } from 'src/auth/decorator/role.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/models/role.enum';
import { RoleStrategy } from 'src/auth/strategy/role.strategy';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @RoleTag(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, RoleStrategy)
  @Post('create')
  create(@Body() feedPost: FeedPost, @Request() req): Promise<any> {
    return this.feedService.createPost(req.user, feedPost);
  }

  // @Get('find')
  //  findAll(): Promise<FeedPost[]>{
  //     return  this.feedService.findAllPost();
  // }

  @Get()
  findSelected(
    @Query('take') take: number = 1,
    @Query('skip') skip: number = 1,
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findPost(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
  ): Promise<UpdateResult> {
    return this.feedService.updatePost(id, feedPost);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
