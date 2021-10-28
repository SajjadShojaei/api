import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}
    
    @Post('create')
    async create(@Body() post:FeedPost): Promise<any>
     {
        return await this.feedService.createPost(post)
    }
}
