import nodemailer from 'nodemailer'
import constants from '../config/constants';
import User from '../models/user.models';

class MailService{
    constructor(email, otp, user){
        this.email = email;
        this.otp = otp;
        this.user = user;
        this.transporter =  nodemailer.createTransport({
          service: 'gmail',
          tls: { rejectUnauthorized: false } ,
            auth: {
              user: constants.EMAIL_ADDRESS,
              pass: constants.EMAIL_PASSWORD,
            },
          });
    }

    async sendEmail(){
      

        await this.transporter.sendMail(this.getEmailTemplate(), (err, response) => {
            if (err) {
                console.error('there was an error: ', err);
              } else {
                let dateNow = new Date()
                this.user.resetPasswordOTP = this.otp;
                this.user.resetPasswordExpires = dateNow.setDate(dateNow.getDate() + 1);
                 this.user.save()
              
              }
        });

    }

    getEmailTemplate(){
      

        return {
            from: constants.EMAIL_ADDRESS,
            to: `${this.email}`,
            subject: 'Link To Reset Password',
            html:
              'Hi '+ this.email +', \n\n'
              + 'your totally secure one time password, which was sent to you over an unencryted media, is: \n\n'
              
              +'<b>'+ this.otp + '</b> \n\n'
              
              + 'Disclaimer: Please do not print this email. Save the environment. \n\n '
              + 'If this email was not ment for you - since you are the hacker - please inform the sender and destroy this email!',
          };
    }

}

export default MailService;