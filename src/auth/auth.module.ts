import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'rxjs';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt_strategy';
import { RoleStrategy } from './strategy/role.strategy';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FriendRequestEntity } from './models/friend-request.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
      JwtModule.registerAsync({
        useFactory: () => ({
          secret: 'jwt_secret',
          signOptions: { expiresIn: '3600s' },
        }),
  }),
  ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RoleStrategy, UserService],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService]
})
export class AuthModule {}
