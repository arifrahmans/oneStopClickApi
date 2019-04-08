import {Router} from 'express';
import * as userController from '../controllers/user.controllers';
import validate from 'express-validation';
import userValidation from '../validations/user.validations'
import { authLocal, authGoogle, authTwitter } from '../services/auth.services';


const routes = new Router();

routes.post('/users/signup', validate(userValidation.signup),userController.signUp);
routes.post('/users/login',authLocal,userController.login);
routes.post('/users/forgot_password',userController.forgotPassword);
routes.post('/users/reset_password', userController.resetPassword);
routes.post('/users/auth_google',authGoogle,userController.googleAuth);
routes.post('/users/auth_twitter',authTwitter,userController.twitterAuth);

export default routes;