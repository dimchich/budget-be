import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto, UserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import { UserEntity } from '../entity/users.entity';
import { isEmpty } from '../utils/util';

class UserService {
  public users = UserEntity;

  static toDTO(user: User): UserDto {
    const dto: UserDto = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return dto;
  }

  public async findAllUser(): Promise<User[]> {
    const userRepository = getRepository(this.users);
    const users: User[] = await userRepository.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, 'User not found');

    return findUser;
  }

  public async findUserByName(name: string): Promise<User> {
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { name } });
    if (!findUser) throw new HttpException(404, 'User not found');

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'Empty user data');

    const userRepository = getRepository(this.users);
    const findUserEmail: User = await userRepository.findOne({ where: { email: userData.email } });
    if (findUserEmail) throw new HttpException(409, `Email ${userData.email} already exists`);
    const findUserName: User = await userRepository.findOne({ where: { name: userData.name } });
    if (findUserName) throw new HttpException(409, `Name ${userData.name} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await userRepository.save({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'Empty user data');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, 'User not found');

    if (userData.email && userData.email !== findUser.email) {
      const findUserEmail: User = await userRepository.findOne({ where: { email: userData.email } });
      if (findUserEmail) throw new HttpException(409, `Email ${userData.email} already exists`);
    }
    if (userData.name && userData.name !== findUser.name) {
      const findUserName: User = await userRepository.findOne({ where: { name: userData.name } });
      if (findUserName) throw new HttpException(409, `Name ${userData.name} already exists`);
    }
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : findUser.password;
    await userRepository.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await userRepository.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, 'User not found');
    await userRepository.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
