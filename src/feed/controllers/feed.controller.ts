import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}
    
    @Post()
    create(@Body() post:FeedPost): Observable<FeedPost>
     {
        return this.feedService.createPost(post)
    }
}
