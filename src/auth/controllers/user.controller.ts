import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { RoleTag } from '../decorator/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { saveImageToStorage } from '../helpers/image-storage';
import { Role } from '../models/role.enum';
import { User } from '../models/user.interface';
import { UserService } from '../services/user.service';
import { RoleStrategy } from '../strategy/role.strategy';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
        ){}

    // @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req): any{
        const fileName = file?.filename;

        if (!fileName) return of({ error: 'file must be a png, jpg/jpeg' })
    }
        

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @RoleTag(Role.ADMIN)
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
