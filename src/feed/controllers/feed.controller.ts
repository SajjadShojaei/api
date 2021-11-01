import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleTag } from 'src/auth/decorator/role.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/models/role.enum';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}
    
    @RoleTag(Role.ADMIN,Role.PREMIUM)
    @UseGuards(JwtGuard)
    @Post('create')
     create(@Body() feedPost:FeedPost, @Request() req): Promise<any>
     {
        return  this.feedService.createPost(req.user, feedPost);
    }
    @Get('find')
     findAll(): Promise<FeedPost[]>{
        return  this.feedService.findAllPost();
    }

    @Put(':id')
     update(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
     ): Promise<UpdateResult>{
        return  this.feedService.updatePost(id, feedPost);
    }

    @Delete(':id')
     delete(
        @Param('id') id: number
    ): Promise<DeleteResult> {
        return  this.feedService.deletePost(id);
    }
}
