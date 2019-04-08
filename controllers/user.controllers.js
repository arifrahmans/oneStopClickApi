import HTTPStatus from 'http-status';
import User from '../models/user.models';
import Token from '../lib/token'
import MailService from '../lib/mailService'
import * as otpGenerator from 'otp-generator';

export async function signUp(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());

  return next();
}

export async function forgotPassword(req, res) {
  try {
    let email = req.body.email;
    let user = await User.findOne({
      email
    });

    if (!user) {
      res.status(HTTPStatus.NOT_FOUND).send({
        error: true,
        message: "User does not exist"
      });
    } else {
      let newOtp = await otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false
      });
      let mailService = new MailService(email, newOtp, user);
      mailService.sendEmail()
      res.status(HTTPStatus.OK).send({
        error: false,
        message: "OTP has been sent."
      });

    }
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function resetPassword(req, res) {
  try {
    let email = req.body.email;
    let otp = req.body.otp;
    let newPassword = req.body.newPassword;
    let today = new Date();


    let user = await User.findOne({
      email
    });
    console.log(req.body);

    if (!user) {
      res.status(HTTPStatus.NOT_FOUND).send({
        error: true,
        message: "User does not exist"
      });
    } else {
      if ((user.resetPasswordOTP === otp) && (today < user.resetPasswordExpires)) {

        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        user.password = newPassword;


        res.status(HTTPStatus.OK).send(await user.save());
      } else {
        res.status(HTTPStatus.OK).send({
          error: false,
          message: "Save new Password Failed. Please check OTP code."
        });
      }




    }
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function googleAuth(req, res, next) {
  if (!req.user) {
    res.send(401, {
      error: true,
      message: 'User Not Authenticated'
    });
  } else {
    res.status(HTTPStatus.OK).json(await req.user.toGoogleJSON());
  }
  return next();
}

export async function twitterAuth(req, res, next) {
  if (!req.user) {
    res.send(401, {
      error: true,
      message: 'User Not Authenticated'
    });
  } else {
    res.status(HTTPStatus.OK).json(await req.user.toTwitterSON());
  }


  return next();
}