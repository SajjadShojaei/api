import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt  from 'bcrypt';
import { map, Observable, switchMap,pipe, from } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';

@Injectable()
export class AuthService {
  findUserById(userId: number) {
    throw new Error('Method not implemented.');
  }
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtSerice: JwtService
    ){}

     hashPassword(password: string): Observable<string> {
       return from( bcrypt.hash(password, 12))
    }

     registerAccount ( user: User) : Observable<User> {
        const { firstName, lastName, email, password } = user;

        return  this.hashPassword(password).pipe(switchMap((hashedPassword:string)=>{
            return from(this.userRepository.save({
                firstName,lastName,email,password:hashedPassword
            }))
        }))
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(
          this.userRepository.findOne(
            { email },
            {
              select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
            },
          ),
        ).pipe(
          switchMap((user: User) => {
            if (!user) {
              throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
                HttpStatus.NOT_FOUND,
              );
            }
            return from(bcrypt.compare(password, user.password)).pipe(
              map((isValidPassword: boolean) => {
                if (isValidPassword) {
                  delete user.password;
                  return user;
                }
              }),
            );
          }),
        );
      }

    login(user: User) :Observable<string> {
        const { email, password } = user;

        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return from(this.jwtSerice.signAsync({ user }))
                }
            })
        );
    }

    
}
