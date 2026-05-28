import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, CanActivate, ExecutionContext, ConflictException } from '@nestjs/common';
import request from 'supertest';
import { PollController } from '../src/poll/poll.controller';
import { PollService } from '../src/poll/poll.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/common/guards/permissions.guard';
import { Permission } from '../src/common/enums/permissions.enum';

const MOCK_USER = {
  userId: 1,
  username: 'testuser',
  permissions: [
    Permission.CREATE_POLL,
    Permission.WATCH_POLL,
    Permission.UPDATE_POLL,
    Permission.DELETE_POLL,
  ],
};

class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest().user = MOCK_USER;
    return true;
  }
}

class MockPermissionsGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

const mockPollService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findAllByUserId: jest.fn(),
  savePollAnswers: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getPollResults: jest.fn(),
};

describe('PollController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollController],
      providers: [
        { provide: PollService, useValue: mockPollService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtGuard)
      .overrideGuard(PermissionsGuard)
      .useClass(MockPermissionsGuard)
      .compile();

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

  // ─── POST /poll ────────────────────────────────────────────────────────────

  describe('POST /poll', () => {
    const validBody = {
      title: 'Test Poll',
      description: 'A description',
      questions: [{ text: 'Q1', options: [{ text: 'A' }, { text: 'B' }] }],
    };

    it('should create a poll and return 201', async () => {
      const created = { id: 1, ...validBody };
      mockPollService.create.mockResolvedValue(created);

      const res = await request(app.getHttpServer())
        .post('/poll')
        .send(validBody)
        .expect(201);

      expect(res.body).toEqual(created);
      expect(mockPollService.create).toHaveBeenCalledWith(validBody);
    });

    it('should return 400 when title is missing', async () => {
      const { title: _omit, ...body } = validBody;

      await request(app.getHttpServer())
        .post('/poll')
        .send(body)
        .expect(400);

      expect(mockPollService.create).not.toHaveBeenCalled();
    });

    it('should return 400 when description is missing', async () => {
      const { description: _omit, ...body } = validBody;

      await request(app.getHttpServer())
        .post('/poll')
        .send(body)
        .expect(400);

      expect(mockPollService.create).not.toHaveBeenCalled();
    });

    it('should return 400 when questions is not an array', async () => {
      await request(app.getHttpServer())
        .post('/poll')
        .send({ ...validBody, questions: 'not-an-array' })
        .expect(400);
    });
  });

  // ─── GET /poll ─────────────────────────────────────────────────────────────

  describe('GET /poll', () => {
    it('should return polls list', async () => {
      const pollsDto = {
        polls: [
          { id: 1, title: 'Poll 1', description: 'Desc', createdBy: 'Alice' },
        ],
        totalPolls: 1,
      };
      mockPollService.findAll.mockResolvedValue(pollsDto);

      const res = await request(app.getHttpServer()).get('/poll').expect(200);

      expect(res.body).toEqual(pollsDto);
      expect(mockPollService.findAll).toHaveBeenCalled();
    });

    it('should return empty polls list', async () => {
      mockPollService.findAll.mockResolvedValue({ polls: [], totalPolls: 0 });

      const res = await request(app.getHttpServer()).get('/poll').expect(200);

      expect(res.body).toEqual({ polls: [], totalPolls: 0 });
    });
  });

  // ─── GET /poll/my ──────────────────────────────────────────────────────────

  describe('GET /poll/my', () => {
    it('should return polls for the authenticated user', async () => {
      const pollsDto = {
        polls: [{ id: 3, title: 'My Poll', description: 'Desc', createdBy: 'testuser' }],
        totalPolls: 1,
      };
      mockPollService.findAllByUserId.mockResolvedValue(pollsDto);

      const res = await request(app.getHttpServer()).get('/poll/my').expect(200);

      expect(res.body).toEqual(pollsDto);
      expect(mockPollService.findAllByUserId).toHaveBeenCalledWith(MOCK_USER.userId);
    });
  });

  // ─── GET /poll/:id ─────────────────────────────────────────────────────────

  describe('GET /poll/:id', () => {
    it('should return a single poll', async () => {
      const pollDto = {
        id: 1,
        title: 'Test Poll',
        description: 'Desc',
        questions: [{ id: 10, text: 'Q1', options: [{ id: 100, text: 'A' }] }],
      };
      mockPollService.findOne.mockResolvedValue(pollDto);

      const res = await request(app.getHttpServer()).get('/poll/1').expect(200);

      expect(res.body).toEqual(pollDto);
      expect(mockPollService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return 500 when poll is not found (service throws Error)', async () => {
      mockPollService.findOne.mockRejectedValue(new Error('Poll with ID 99 not found'));

      await request(app.getHttpServer()).get('/poll/99').expect(500);
    });
  });

  // ─── POST /poll/:id/answers ────────────────────────────────────────────────

  describe('POST /poll/:id/answers', () => {
    const validBody = { answers: [{ optionId: 100 }, { optionId: 101 }] };

    it('should save answers and return 201', async () => {
      mockPollService.savePollAnswers.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .post('/poll/1/answers')
        .send(validBody)
        .expect(201);

      expect(mockPollService.savePollAnswers).toHaveBeenCalledWith({
        pollId: 1,
        userId: MOCK_USER.userId,
        options: [100, 101],
      });
    });

    it('should return 409 when user already answered the poll', async () => {
      mockPollService.savePollAnswers.mockRejectedValue(
        new ConflictException('User has already answered this poll!'),
      );

      const res = await request(app.getHttpServer())
        .post('/poll/1/answers')
        .send(validBody)
        .expect(409);

      expect(res.body.message).toBe('User has already answered this poll!');
    });

    it('should return 400 when answers body is invalid', async () => {
      await request(app.getHttpServer())
        .post('/poll/1/answers')
        .send({ answers: 'not-an-array' })
        .expect(400);

      expect(mockPollService.savePollAnswers).not.toHaveBeenCalled();
    });
  });

  // ─── PATCH /poll/:id ───────────────────────────────────────────────────────

  describe('PATCH /poll/:id', () => {
    it('should update and return updated fields', async () => {
      const updated = { title: 'New Title', description: 'Desc', isActive: false };
      mockPollService.update.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .patch('/poll/5')
        .send({ title: 'New Title', isActive: false })
        .expect(200);

      expect(res.body).toEqual(updated);
      expect(mockPollService.update).toHaveBeenCalledWith(
        5,
        { title: 'New Title', isActive: false },
        MOCK_USER.userId,
      );
    });

    it('should return 500 when poll not found or permission denied', async () => {
      mockPollService.update.mockRejectedValue(
        new Error("Poll with ID 5 not found or you don't have permission to update it"),
      );

      await request(app.getHttpServer())
        .patch('/poll/5')
        .send({ title: 'X' })
        .expect(500);
    });

    it('should return 400 when isActive is not boolean', async () => {
      await request(app.getHttpServer())
        .patch('/poll/5')
        .send({ isActive: 'yes' })
        .expect(400);

      expect(mockPollService.update).not.toHaveBeenCalled();
    });
  });

  // ─── DELETE /poll/:id ──────────────────────────────────────────────────────

  describe('DELETE /poll/:id', () => {
    it('should remove a poll and return 200', async () => {
      mockPollService.remove.mockReturnValue('This action removes a #3 poll');

      const res = await request(app.getHttpServer()).delete('/poll/3').expect(200);

      expect(res.text).toBe('This action removes a #3 poll');
      expect(mockPollService.remove).toHaveBeenCalledWith(3);
    });
  });
});
