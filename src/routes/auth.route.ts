import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { CreateUserDto } from '../dtos/users.dto';
import { AuthDto } from '../dtos/auth.dto';
import Route from '../interfaces/routes.interface';
import { isLoggedIn, notLoggedIn } from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

class AuthRoute implements Route {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', notLoggedIn, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post('/login', notLoggedIn, validationMiddleware(AuthDto, 'body'), this.authController.logIn);
    this.router.post('/logout', isLoggedIn, this.authController.logOut);
  }
}

export default AuthRoute;
