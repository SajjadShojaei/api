import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/auth/models/user.class';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class FeedService {
    constructor (
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository: Repository<FeedPostEntity>
    ){}

     createPost(user: User, feedPost: FeedPost): Promise<FeedPost> {
        feedPost.author = user;
        return this.feedPostRepository.save(feedPost);
    }

     findAllPost(): Promise<FeedPost[]>{
        return this.feedPostRepository.find();
    }

    findPost(take: number = 10, skip: number = 0): Observable<FeedPost[]> {
    return from(
      this.feedPostRepository.findAndCount({ take, skip }).then(([posts]) => {
        return <FeedPost[]>posts;
      }),
    );
  }

     updatePost(id: number, feedPost: FeedPost): Promise<UpdateResult> {
        return this.feedPostRepository.update(id, feedPost);
    }

     deletePost(id: number): Promise<DeleteResult> {
        return this.feedPostRepository.delete(id);
    }

    findPostById(id: number) : Observable<FeedPost> {
        return from(this.feedPostRepository.findOne({ id }, { relations: ['author'] }));

    }
}
