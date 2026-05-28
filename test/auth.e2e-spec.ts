import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ConflictException, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── POST /auth/register ───────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    const validBody = { name: 'John', email: 'john@example.com', password: 'secret123' };

    it('should register and return 201 with access token', async () => {
      mockAuthService.register.mockResolvedValue({ access_token: 'token' });

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(validBody)
        .expect(201);

      expect(res.body).toEqual({ access_token: 'token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(validBody);
    });

    it('should return 409 when email is already taken', async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(validBody)
        .expect(409);

      expect(res.body.message).toBe('User with this email already exists');
    });

    it('should return 400 when name is missing', async () => {
      const { name: _omit, ...body } = validBody;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(body)
        .expect(400);

      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should return 400 when email is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...validBody, email: 'not-an-email' })
        .expect(400);

      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should return 400 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...validBody, password: '123' })
        .expect(400);

      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  // ─── POST /auth/login ──────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    const validBody = { email: 'john@example.com', password: 'secret123' };

    it('should login and return 201 with access token', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(validBody)
        .expect(201);

      expect(res.body).toEqual({ access_token: 'token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(validBody);
    });

    it('should return 401 when credentials are invalid', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(validBody)
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 400 when email is missing', async () => {
      const { email: _omit, ...body } = validBody;

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(400);

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return 400 when email is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...validBody, email: 'bad-email' })
        .expect(400);

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});
