import { IsString, IsInt } from 'class-validator';
import { User } from '../interfaces/users.interface';

export class CreateGroupDto {
  @IsString()
  public name: string;

  @IsInt()
  public author: User;
}

export class GroupDto {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;

  @IsInt()
  public authorId: number;
}
