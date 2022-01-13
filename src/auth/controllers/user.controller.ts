import { Body, Controller, Get, Param, Post, Put, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { RoleTag } from '../decorator/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { isFileExtentionSafe, removeFile, saveImageToStorage } from '../helpers/image-storage';
import { FriendRequest, FriendRequeststatus } from '../models/friend-request.interface';
import { Role } from '../models/role.enum';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';
import { RoleStrategy } from '../strategy/role.strategy';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req): Observable<UpdateResult | { error: string }> {
        const fileName = file?.filename;

        if (!fileName) return of({ error: 'file must be a png, jpg/jpeg' });

        const imageFolderPath = join(process.cwd(), 'images');
        const fullImagePath = join(imageFolderPath + '/' + file.filename);

        return isFileExtentionSafe(fullImagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    const userId = req.user.id;
                    return this.userService.updateUserImageById(userId, fileName);
                } else {
                    removeFile(fullImagePath);
                    return of({ error: 'file content dose not match extention!' });
                }


            })
        )

    }


    @UseGuards(JwtGuard)
    @Get('image')
    findImage(@Req() req, @Res() res): Observable<object> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of(res.sendFile(imageName, { root: './images' }));
            })
        )
    }
    @UseGuards(JwtGuard)
    @Get(':userId')
    findUserById(@Param('userId') userStringId: string): Observable<User> {
        const userId = parseInt(userStringId)
        return this.userService.findUserById(userId);
    }

    @UseGuards(JwtGuard)
    @Post('friend-request/send/:reciverId')
    sendFriendRequest(@Param('reciverId') resiverStringId: string,
        @Request() req,
    ): Observable<FriendRequest | { error: string }> {
        const reciverId = parseInt(resiverStringId);
        return this.userService.sendFriendRequest(reciverId, req.user);
    }

    @UseGuards(JwtGuard)
    @Get('friend-request/status/:reciverId')
    getFriendRequestStatus(@Param('reciverId') reciverStringId: string,
        @Request() req,
    ): Observable<FriendRequeststatus> {
        const reciverId = parseInt(reciverStringId)
        return this.userService.getFriendRequestStatus(reciverId, req.user);
    }
    @UseGuards(JwtGuard)
    @Put('friend-request/response/:friendReqestId')
    responsetoFriendReqest(
        @Param('friendReqestId') friendReqestStringId: string,
        @Body() statsResponse: FriendRequeststatus,
    ): Observable<FriendRequeststatus> {
        const friendReqestId = parseInt(friendReqestStringId)
        return this.userService.responsetoFriendReqest(statsResponse.status, friendReqestId);
    }

    @UseGuards(JwtGuard)
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecipients(
    @Request() req,
  ): Observable<FriendRequeststatus[]> {
    return this.userService.getFriendRequestsFromRecipients(req.user);
  }


    // @Get(':id')
    // findOne(@Param() params): Observable<User> {
    //     return this.userService.findOne(params.id);
    // }

    @RoleTag(Role.ADMIN)
    @UseGuards(JwtGuard, RoleStrategy)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }
}
