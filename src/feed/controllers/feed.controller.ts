import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}
    
    @Post('create')
    async create(@Body() feedPost:FeedPost): Promise<any>
     {
        return await this.feedService.createPost(feedPost);
    }
    @Get('find')
    async findAll(): Promise<FeedPost[]>{
        return await this.feedService.findAllPost();
    }

    @Put(':id')
    async update(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
     ): Promise<UpdateResult>{
        return await this.feedService.updatePost(id, feedPost);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number
    ): Promise<DeleteResult> {
        return await this.feedService.deletePost(id);
    }
}
