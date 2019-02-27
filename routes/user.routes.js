import {Router} from 'express';
import * as userController from '../controllers/user.controllers';
import validate from 'express-validation';
import userValidation from '../validations/user.validations'
import { authLocal } from '../services/auth.services';


const routes = new Router();

routes.post('/signup', validate(userValidation.signup),userController.signUp);
routes.post('/login',authLocal,userController.login);

export default routes;