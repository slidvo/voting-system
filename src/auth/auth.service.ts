import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@src/user/entities/user.entity';
import { USER_REPOSITORY } from '@src/user/user.constants';
import { RegisterBodyRqDto } from './dto/RegisterBodyRqDto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterBodyRqDto): Promise<{ access_token: string }> {
        const existing = await this.userRepository.findOneBy({ email: dto.email });
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });
        await this.userRepository.save(user);

        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwtService.sign(payload) };
    }
}
