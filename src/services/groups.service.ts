import { getRepository } from 'typeorm';
import { CreateGroupDto, GroupDto } from '../dtos/groups.dto';
import HttpException from '../exceptions/HttpException';
import { Group } from '../interfaces/groups.interface';
import { GroupEntity } from '../entity/groups.entity';
import { isEmpty } from '../utils/util';
import userService from './users.service';

class GroupService {
  public groups = GroupEntity;
  private userService = new userService();

  static toDTO(group: Group): GroupDto {
    const dto: GroupDto = {
      id: group.id,
      name: group.name,
      authorId: group.authorId,
    };
    return dto;
  }

  public async filndAllgroups(): Promise<GroupDto[]> {
    const groupRepository = getRepository(this.groups);
    console.log('test');
    const groups: Group[] = await groupRepository.find();
    return groups.map(GroupService.toDTO);
  }

  public async findGroupById(groupId: number): Promise<GroupDto> {
    const groupRepository = getRepository(this.groups);
    const group: Group = await groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new HttpException(404, 'Group not found');

    return GroupService.toDTO(group);
  }

  public async createGroup(groupData: CreateGroupDto): Promise<GroupDto> {
    if (isEmpty(groupData)) throw new HttpException(400, 'Group data error');

    const groupRepository = getRepository(this.groups);
    const existedGroup = await groupRepository.findOne({ where: { name: groupData.name } });
    console.log(existedGroup);
    if (existedGroup) throw new HttpException(400, `Group with name ${groupData.name} already exists`);
    const author = await this.userService.findUserById(Number(groupData.author));

    if (!author) throw new HttpException(400, 'Author not exists');
    const createdGorup: Group = await groupRepository.save({ ...groupData, authorId: Number(groupData.author) });

    return GroupService.toDTO(createdGorup);
  }

  public async updateGroup(groupId: number, groupData: Group): Promise<GroupDto> {
    if (isEmpty(groupData)) throw new HttpException(400, 'Group data error');

    const groupRepository = getRepository(this.groups);
    const group: Group = await groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new HttpException(404, 'Group not found');

    const existedGroup = await groupRepository.findOne({ where: { name: groupData.name } });
    if (existedGroup) throw new HttpException(400, `Group with name ${groupData.name} already exists`);

    await groupRepository.update(groupId, { ...groupData });
    const updatedGroup: Group = await groupRepository.findOne({ where: { id: groupId } });
    return GroupService.toDTO(updatedGroup);
  }

  public async deleteGroup(groupId: number): Promise<GroupDto> {
    const groupRepository = getRepository(this.groups);
    const group = await groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new HttpException(404, 'Group not found');

    await groupRepository.delete({ id: groupId });
    return GroupService.toDTO(group);
  }
}

export default GroupService;
