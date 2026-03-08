import { Test, TestingModule } from '@nestjs/testing';
import EventService from './event.service';
import EventRepository from './event.repository';
import HouseService from 'src/house/house.service';
import { BadRequestException } from '@nestjs/common';
import User from 'src/database/entities/user/user.entity';
import Event from 'src/database/entities/event/event.entity';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: EventRepository;
  let houseService: HouseService;

  const mockUser = { id: 1 } as User;
  const mockEvent = { id: 1, houseId: 1, name: 'Test Event' } as Event;

  const mockEventRepository = {
    listEventsByHouseId: jest.fn(),
    createEvent: jest.fn(),
    getEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  };

  const mockHouseService = {
    checkIfUserisOnHouse: jest.fn(),
    checkIfUserisOnHouseAndUser: jest.fn(),
    checkIfUserisOnHouseAndAdmin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventRepository, useValue: mockEventRepository },
        { provide: HouseService, useValue: mockHouseService },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<EventRepository>(EventRepository);
    houseService = module.get<HouseService>(HouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listEventsByHouse', () => {
    it('should return events if user is in house', async () => {
      mockHouseService.checkIfUserisOnHouse.mockResolvedValue(undefined);
      mockEventRepository.listEventsByHouseId.mockResolvedValue([mockEvent]);

      const result = await service.listEventsByHouse(mockUser, 1);
      expect(result).toHaveLength(1);
      expect(houseService.checkIfUserisOnHouse).toHaveBeenCalledWith(mockUser, 1);
    });
  });

  describe('createEvent', () => {
    it('should create an event', async () => {
      const createDto = { houseId: 1, name: 'New Event' };
      mockHouseService.checkIfUserisOnHouseAndUser.mockResolvedValue(undefined);
      mockEventRepository.createEvent.mockResolvedValue({ id: 2, ...createDto });

      const result = await service.createEvent(mockUser, createDto);
      expect(result).toBeDefined();
    });
  });

  describe('updateEvent', () => {
    it('should update an event if requester is admin', async () => {
      const updateDto = { id: 1, name: 'Updated Event' };
      mockEventRepository.getEvent.mockResolvedValue(mockEvent);
      mockHouseService.checkIfUserisOnHouseAndAdmin.mockResolvedValue(undefined);
      mockEventRepository.updateEvent.mockResolvedValue(updateDto);

      const result = await service.updateEvent(mockUser, updateDto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if event not found', async () => {
      mockEventRepository.getEvent.mockResolvedValue(null);
      await expect(service.updateEvent(mockUser, { id: 99 } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetTimeEvent', () => {
    it('should update updatedAt field', async () => {
      mockEventRepository.getEvent.mockResolvedValue(mockEvent);
      mockHouseService.checkIfUserisOnHouseAndUser.mockResolvedValue(undefined);
      mockEventRepository.updateEvent.mockResolvedValue({ ...mockEvent, updatedAt: new Date() });

      const result = await service.resetTimeEvent(mockUser, 1);
      expect(result).toBeDefined();
    });
  });
});
