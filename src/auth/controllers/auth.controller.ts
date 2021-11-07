import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RoleTag } from '../decorator/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { Role } from '../models/role.enum';
import { User } from '../models/user.interface';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RoleStrategy } from '../strategy/role.strategy';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
        ){}

    @Post('register')
     register(@Body() user: User): Observable<User> {
        return this.authService.registerAccount(user);
    }

    @Post('login')
    login(@Body() user: User): Observable<{ token: string }> {
        return this.authService
          .login(user)
          .pipe(map((jwt: string) => ({ token: jwt })));
      }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @RoleTag(Role.ADMIN,Role.PREMIUM)
    @UseGuards(JwtGuard, RoleStrategy)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User) :Observable<User>{
        return this.userService.updateRoleOfUser(Number(id), user);
      }

     @Get()
     findAll() :Observable<User[]>{
         return this.userService.findAll();
     }
}
