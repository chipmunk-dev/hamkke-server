import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('createUser', async () => {
    const user: CreateUserDto = {
      username: 'test@test.com',
      password: 'test',
      nickname: 'test',
    };
    const createdUser: User = {
      ...user,
      id: 1,
      profileImageUrl: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    jest.spyOn(repository, 'create').mockReturnValue(createdUser);
    jest.spyOn(repository, 'save').mockResolvedValue(createdUser);

    const result = await service.createUser(user);
    expect(result).toEqual(createdUser);
    expect(repository.create).toHaveBeenCalledWith(user);
    expect(repository.save).toHaveBeenCalledWith(createdUser);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('findUserByUsername', async () => {
    const username: string = 'test@test.com';
    const user: User = {
      username: 'test@test.com',
      password: 'test',
      nickname: 'test',
      id: 1,
      profileImageUrl: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findUserByUsername(username);
    expect(result).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
    expect(repository.findOne).toHaveBeenCalledTimes(1);
  });
});
