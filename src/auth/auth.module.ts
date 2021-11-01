import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'rxjs';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt_strategy';

@Module({
    imports: [
      JwtModule.registerAsync({
        useFactory: () => ({
          secret: 'jwt_secret',
          signOptions: { expiresIn: '3600s' },
        }),
  }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService, JwtGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthModule]
})
export class AuthModule {}
