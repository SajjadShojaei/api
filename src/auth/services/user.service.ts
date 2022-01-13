import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../models/friend-request.entity';
import { FriendRequest, FriendRequeststatus, FriendRequest_status } from '../models/friend-request.interface';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) { }

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

  updateRoleOfUser(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      })
    )
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) { delete v.password });
        return users;
      })
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password
        return user.imagePath;
      })
    )
  }

  hasRequestBeenSentOrReceived(creator: User, reciver: User): Observable<boolean> {
    return from(this.friendRequestRepository.findOne({
      where: [
        { creator, reciver },
        { creator: reciver, reciver: creator },
      ]
    })).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (!friendRequest) return of(false);
        return of(true);
      })
    )
  }

  sendFriendRequest(reciverId: number, creator: User): Observable<FriendRequest | { error: string }> {
    if (reciverId === creator.id) return of({ error: 'It is not possible to add yourserf!!' });

    return this.findUserById(reciverId).pipe(
      switchMap((reciver: User) => {
        return this.hasRequestBeenSentOrReceived(creator, reciver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived) return of({ error: 'A friend Request  has already been sent of recieved to your account!!' })
            let freiendRequest: FriendRequest = {
              creator,
              reciver,
              status: 'pending'
            };
            return from(this.friendRequestRepository.save(freiendRequest))
          })
        )
      })
    )
  }

  getFriendRequestStatus(reciverId: number, currentUser: User): Observable<FriendRequeststatus> {
    return this.findUserById(reciverId).pipe(
      switchMap((reciver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            creator: currentUser,
            reciver,
          })
        )
      }),
      switchMap((friendRequest: FriendRequest) => {
        return of({ status: friendRequest.status });
      })
      )   
  }

  getFriendRequestUserById(friendReqestId: number): Observable<FriendRequest>{
    return from(this.friendRequestRepository.findOne({
      where: [{id: friendReqestId}]
    }))
  }

  responsetoFriendReqest(
    statusResponse: FriendRequest_status,
    friendReqestId: number
  ): Observable<FriendRequeststatus> {
    return this.getFriendRequestUserById(friendReqestId).pipe(
      switchMap((friendReqest: FriendRequest) => {
        return from(this.friendRequestRepository.save({
          ...friendReqest,
          status: statusResponse,
        }))
      })
    )
  }

  getFriendRequestsFromRecipients(
    currentUser: User,
  ): Observable<FriendRequest[]> {
    return from(
      this.friendRequestRepository.find({
        where: [{ reciver: currentUser }],
        relations: ['reciver', 'creator'],
      }),
    );
  }

}
