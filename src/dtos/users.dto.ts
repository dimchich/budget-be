import { IsEmail, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public name: string;
}

export class UserDto {
  @IsInt()
  public id: number;

  @IsEmail()
  public email: string;

  @IsString()
  public name: string;
}
