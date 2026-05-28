import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './entities/poll.entity';
import { AnswerRepository } from './answer.repository';
import { PollGateway } from './poll.gateway';

const mockPollRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneWithResults: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
};

const mockAnswerRepository = {
  saveAnswers: jest.fn(),
};

const mockPollGateway = {
  broadcastResults: jest.fn(),
};

describe('PollService', () => {
  let service: PollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        { provide: PollGateway, useValue: mockPollGateway },
        { provide: PollRepository, useValue: mockPollRepository },
        { provide: AnswerRepository, useValue: mockAnswerRepository },
      ],
    }).compile();

    service = module.get<PollService>(PollService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call pollRepository.create with the given dto and return the result', async () => {
      const dto: CreatePollDto = {
        title: 'Test Poll',
        description: 'Test description',
        questions: [],
      };
      const createdPoll = { id: 1, ...dto } as unknown as Poll;
      mockPollRepository.create.mockResolvedValue(createdPoll);

      const result = await service.create(dto);

      expect(mockPollRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdPoll);
    });
  });

  describe('findAll', () => {
    it('should return a PollsDto with mapped polls including createdBy and totalPolls', async () => {
      const polls = [
        { id: 1, title: 'Poll 1', description: 'Desc 1', creator: { name: 'Alice' } },
        { id: 2, title: 'Poll 2', description: 'Desc 2', creator: { name: 'Bob' } },
      ] as Poll[];
      mockPollRepository.findAll.mockResolvedValue(polls);

      const result = await service.findAll();

      expect(mockPollRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        polls: [
          { id: 1, title: 'Poll 1', description: 'Desc 1', createdBy: 'Alice' },
          { id: 2, title: 'Poll 2', description: 'Desc 2', createdBy: 'Bob' },
        ],
        totalPolls: 2,
      });
    });

    it('should return empty polls array and totalPolls 0 when repository returns no polls', async () => {
      mockPollRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual({ polls: [], totalPolls: 0 });
    });
  });

  describe('findOne', () => {
    it('should return a PollDto with mapped questions and options', async () => {
      const poll = {
        id: 1,
        title: 'Test Poll',
        description: 'Test desc',
        questions: [
          {
            id: 10,
            text: 'Question 1',
            options: [
              { id: 100, text: 'Option A' },
              { id: 101, text: 'Option B' },
            ],
          },
        ],
      } as Poll;
      mockPollRepository.findOne.mockResolvedValue(poll);

      const result = await service.findOne(1);

      expect(mockPollRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        title: 'Test Poll',
        description: 'Test desc',
        questions: [
          {
            id: 10,
            text: 'Question 1',
            options: [
              { id: 100, text: 'Option A' },
              { id: 101, text: 'Option B' },
            ],
          },
        ],
      });
    });

    it('should throw an error when poll is not found', async () => {
      mockPollRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(42)).rejects.toThrow('Poll with ID 42 not found');
    });

    it('should return a PollDto with empty questions array', async () => {
      const poll = {
        id: 2,
        title: 'Empty Poll',
        description: 'No questions',
        questions: [],
      } as unknown as Poll;
      mockPollRepository.findOne.mockResolvedValue(poll);

      const result = await service.findOne(2);

      expect(result).toEqual({
        id: 2,
        title: 'Empty Poll',
        description: 'No questions',
        questions: [],
      });
    });
  });

  describe('savePollAnswers', () => {
    const params = { pollId: 1, userId: 10, options: [100, 101] };

    it('should save answers and broadcast results', async () => {
      mockAnswerRepository.saveAnswers.mockResolvedValue([]);
      mockPollGateway.broadcastResults.mockResolvedValue(undefined);

      await service.savePollAnswers(params);

      expect(mockAnswerRepository.saveAnswers).toHaveBeenCalledWith([
        expect.objectContaining({ userId: 10, optionId: 100 }),
        expect.objectContaining({ userId: 10, optionId: 101 }),
      ]);
      expect(mockPollGateway.broadcastResults).toHaveBeenCalledWith(1);
    });

    it('should throw ConflictException on unique violation (code 23505)', async () => {
      const error = Object.assign(new Error('duplicate'), { code: '23505' });
      mockAnswerRepository.saveAnswers.mockRejectedValue(error);

      await expect(service.savePollAnswers(params)).rejects.toThrow(ConflictException);
      await expect(service.savePollAnswers(params)).rejects.toThrow('User has already answered this poll!');
    });

    it('should throw generic error on other repository failures', async () => {
      mockAnswerRepository.saveAnswers.mockRejectedValue(new Error('db connection lost'));

      await expect(service.savePollAnswers(params)).rejects.toThrow('Failed to save poll answers');
    });
  });

  describe('update', () => {
    const dto: UpdatePollDto = { title: 'New Title', isActive: false };

    it('should return updated poll fields', async () => {
      const updatedPoll = { title: 'New Title', description: 'Desc', isActive: false };
      mockPollRepository.update.mockResolvedValue(updatedPoll);

      const result = await service.update(5, dto, 10);

      expect(mockPollRepository.update).toHaveBeenCalledWith(5, dto, 10);
      expect(result).toEqual({ title: 'New Title', description: 'Desc', isActive: false });
    });

    it('should propagate error thrown by the repository', async () => {
      mockPollRepository.update.mockRejectedValue(
        new Error("Poll with ID 5 not found or you don't have permission to update it"),
      );

      await expect(service.update(5, dto, 99)).rejects.toThrow(
        "Poll with ID 5 not found or you don't have permission to update it",
      );
    });
  });

  describe('remove', () => {
    it('should return removal confirmation string', () => {
      expect(service.remove(3)).toBe('This action removes a #3 poll');
    });
  });

  describe('getPollResults', () => {
    it('should return formatted poll results with vote counts', async () => {
      const poll = {
        id: 1,
        title: 'My Poll',
        questions: [
          {
            id: 10,
            text: 'Q1',
            options: [
              { id: 100, text: 'A', answers: [{}, {}] },
              { id: 101, text: 'B', answers: [{}] },
            ],
          },
        ],
      } as unknown as Poll;
      mockPollRepository.findOneWithResults.mockResolvedValue(poll);

      const result = await service.getPollResults(1);

      expect(mockPollRepository.findOneWithResults).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        pollId: 1,
        title: 'My Poll',
        questions: [
          {
            questionId: 10,
            text: 'Q1',
            options: [
              { optionId: 100, text: 'A', votes: 2 },
              { optionId: 101, text: 'B', votes: 1 },
            ],
          },
        ],
      });
    });

    it('should throw NotFoundException when poll is not found', async () => {
      mockPollRepository.findOneWithResults.mockResolvedValue(null);

      await expect(service.getPollResults(99)).rejects.toThrow(NotFoundException);
      await expect(service.getPollResults(99)).rejects.toThrow('Poll 99 not found');
    });

    it('should throw NotFoundException when poll has no questions', async () => {
      const poll = { id: 1, title: 'Poll', questions: null } as unknown as Poll;
      mockPollRepository.findOneWithResults.mockResolvedValue(poll);

      await expect(service.getPollResults(1)).rejects.toThrow(NotFoundException);
      await expect(service.getPollResults(1)).rejects.toThrow('Poll 1 .questions  not found');
    });
  });

  describe('findAllByUserId', () => {
    it('should return polls created by the given user', async () => {
      const polls = [
        { id: 3, title: 'My Poll', description: 'Desc', creator: { name: 'Alice' } },
      ] as Poll[];
      mockPollRepository.findAllByUserId.mockResolvedValue(polls);

      const result = await service.findAllByUserId(10);

      expect(mockPollRepository.findAllByUserId).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        polls: [{ id: 3, title: 'My Poll', description: 'Desc', createdBy: 'Alice' }],
        totalPolls: 1,
      });
    });

    it('should return empty result when user has no polls', async () => {
      mockPollRepository.findAllByUserId.mockResolvedValue([]);

      const result = await service.findAllByUserId(10);

      expect(result).toEqual({ polls: [], totalPolls: 0 });
    });
  });
});
