import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    console.log('JWT Strategy initialized with secret:', jwtSecret ? 'SECRET_SET' : 'SECRET_MISSING');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      console.log('JWT Strategy validate called with payload:', payload);
      
      if (!payload.sub || !payload.email || !payload.user_type) {
        console.log('JWT Strategy - Invalid payload structure');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      // Handle both admin and regular user tokens
      const user = {
        id: payload.sub,
        email: payload.email,
        user_type: payload.user_type, // This will be 'role' for admin, 'user_type' for regular users
      };
      
      console.log('JWT Strategy returning user:', user);
      return user;
    } catch (error) {
      console.log('JWT Strategy validation error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
} 