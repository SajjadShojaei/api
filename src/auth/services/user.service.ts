import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({ id }, { relations: ['feedPosts'] }),
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
      }),
    );
  }

  updateRoleOfUser(id: number , user:User):Observable<any>{
      return from(this.userRepository.update(id, user));
  }
  
  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({id})).pipe(
        map((user: User) => {
            const {password, ...result} = user;
            return result;
        } )
    )
}

  findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

  updateUserImageById(id: number , imagePath: string): Observable<UpdateResult>{
    const user: User= new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from( this.userRepository.update(id, user));
  }
  
  findImageNameByUserId(id: number): Observable<string>{
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password
        return user.imagePath;
      })
    )
  }

  // sendFriendRequest(reciverId: number, crearor: User): Observable{
    
  // }

}
