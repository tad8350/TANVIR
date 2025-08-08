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
  @ApiOperation({ summary: 'Customer registration (public)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Registration successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 403, description: 'Only customers can register publicly' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.user_type,
    );
  }

  @Post('google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiResponse({ 
    status: 200, 
    description: 'Google authentication successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid Google data' })
  async googleAuth(@Body() body: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    googleId: string; 
    picture?: string; 
  }): Promise<AuthResponseDto> {
    return this.authService.googleAuth(
      body.email,
      body.firstName,
      body.lastName,
      body.googleId,
      body.picture,
    );
  }

  @Post('admin/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto.email, loginDto.password);
  }

  @Post('admin/setup-super-admin')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Setup super admin (one-time only)' })
  @ApiResponse({ status: 201, description: 'Super admin created successfully' })
  @ApiResponse({ status: 409, description: 'Super admin already exists' })
  async setupSuperAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.setupSuperAdmin(registerDto);
  }

  @Post('admin/create')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create admin user (super admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 403, description: 'Only super admin can create admins' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.createAdmin(registerDto);
  }

  @Post('admin/create-brand')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create brand user (admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Brand user created successfully'
  })
  @ApiResponse({ status: 403, description: 'Only admins can create brand users' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createBrandUser(
    @Body() body: { email: string; password: string },
    @CurrentUser() user: any
  ) {
    return this.authService.createBrandUser(
      body.email,
      body.password,
      user.id,
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