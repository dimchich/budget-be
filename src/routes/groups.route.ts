import { Router } from 'express';
import GroupController from '../controllers/groups.controller';
import { CreateGroupDto } from '../dtos/groups.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class GroupsRoute implements Route {
  public path = '/groups';
  public router = Router();
  public gorupController = new GroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.gorupController.getGroups);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.gorupController.getGroupById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateGroupDto, 'body'), this.gorupController.createGroup);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateGroupDto, 'body', true), this.gorupController.updateGroup);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.gorupController.deleteGroup);
  }
}

export default GroupsRoute;
