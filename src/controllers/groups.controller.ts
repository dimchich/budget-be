import { NextFunction, Request, Response } from 'express';
import { CreateGroupDto, GroupDto } from '../dtos/groups.dto';
import { Group } from '../interfaces/groups.interface';
import groupService from '../services/groups.service';

class GroupController {
  public groupService = new groupService();

  public getGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllGroupsData: GroupDto[] = await this.groupService.filndAllgroups();

      res.status(200).json({ data: findAllGroupsData, message: 'findAll' });
    } catch (e) {
      next(e);
    }
  };

  public getGroupById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupId = Number(req.params.id);
      const groupData: GroupDto = await this.groupService.findGroupById(groupId);

      res.status(200).json({ data: groupData, message: 'findById' });
    } catch (e) {
      next(e);
    }
  };

  public createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupData: CreateGroupDto = req.body;
      const createGroupData: GroupDto = await this.groupService.createGroup(groupData);

      res.status(201).json({ data: createGroupData, message: 'created' });
    } catch (e) {
      next(e);
    }
  };

  public updateGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupId = Number(req.params.id);
      const groupData: Group = req.body;
      const updateGroupData: GroupDto = await this.groupService.updateGroup(groupId, groupData);

      res.status(200).json({ data: updateGroupData, message: 'udpated' });
    } catch (e) {
      next(e);
    }
  };

  public deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupId = Number(req.params.id);
      const deleteGroupData: GroupDto = await this.groupService.deleteGroup(groupId);

      res.status(200).json({ data: deleteGroupData, message: 'deleted' });
    } catch (e) {
      next(e);
    }
  };
}

export default GroupController;
