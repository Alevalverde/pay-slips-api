// import { NextFunction, Request, Response } from 'express';
// import { prepareResponse } from '@/utils';
import AuthService from '@/services/auth.service';
// import { User } from '@/models';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  

  // login = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { user, password } = req.body;
      // const { token, userInfo } = await this.authService.login(user, password);
      // return res.json(prepareResponse(200, 'Successful operation', { token, userInfo }));
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // currentUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userInfo = await this.authService.getUserInfo(req.user as User);
  //     return res.json({ message: 'Valid Token', user: userInfo });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // initiateResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { expiresIn } = await this.authService.generateResetPasswordToken(req.body.email);
  //     return res.json(prepareResponse(200, 'Successful operation', { expiresIn }));
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // completeResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     await this.authService.resetPassword(req.body.token, req.body.newPassword);
  //     return res.json({ message: 'Successful operation' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default AuthController;
