import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check' })
  async healthCheck() {
    return { message: 'Auth service is running', timestamp: new Date().toISOString() };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ 
    status: 201, 
    description: 'Registration successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.user_type,
    );
  }

  @Get('test')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Test authentication' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async testAuth(@CurrentUser() user: any) {
    return {
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      },
    };
  }

  @Get('debug-headers')
  @Public()
  @ApiOperation({ summary: 'Debug request headers' })
  async debugHeaders(@Req() req: any) {
    return {
      message: 'Headers debug',
      headers: req.headers,
      authorization: req.headers.authorization,
    };
  }

  @Post('debug-token')
  @Public()
  @ApiOperation({ summary: 'Debug token verification' })
  async debugToken(@Body() body: { token: string }) {
    try {
      const payload = this.authService.verifyToken(body.token);
      return {
        message: 'Token is valid',
        payload,
      };
    } catch (error) {
      return {
        message: 'Token is invalid',
        error: error.message,
      };
    }
  }
} 