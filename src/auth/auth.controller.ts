import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyRqDto } from './dto/RegisterBodyRqDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: RegisterBodyRqDto) {
        return this.authService.register(dto);
    }
}
