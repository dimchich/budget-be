import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto, UserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import UserService from './users.service';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import { UserEntity } from '../entity/users.entity';
import { isEmpty } from '../utils/util';

class AuthService {
  public users = UserEntity;
  private userService = new UserService();

  public async signup(userData: CreateUserDto): Promise<{ cookie: string; user: UserDto }> {
    const createUserData: User = await this.userService.createUser(userData);
    const tokenData = this.createToken(createUserData);
    const cookie = this.createCookie(tokenData);
    const user: UserDto = UserService.toDTO(createUserData);
    return { cookie, user };
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: UserDto }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Body is empty');

    const findUser: User = await this.userService.findUserByName(userData.name);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Wrong crdentials');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    const user = UserService.toDTO(findUser);
    return { cookie, user };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
