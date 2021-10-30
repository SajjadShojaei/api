import { Injectable } from '@nestjs/common';

import * as bcrypt  from 'bcrypt';
import { User } from '../models/user.interface';

@Injectable()
export class AuthService {

    async hashPassword(password: string): Promise<string> {
       return await bcrypt.hash(password, 12)
    }

    async registerAccount ( user: User) : Promise<User> {
        return 
    }

}
