import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterBodyRqDto } from './dto/RegisterBodyRqDto';
import { LoginDto } from './dto/LoginDto';
import { AccessTokenDto } from './dto/AccessTokenDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterBodyRqDto })
    @ApiResponse({ status: 201, description: 'User registered successfully', type: AccessTokenDto })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 409, description: 'Email already taken' })
    register(@Body() dto: RegisterBodyRqDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 201, description: 'Login successful', type: AccessTokenDto })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
