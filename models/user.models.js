import mongoose, { Schema} from 'mongoose'
import validator from 'validator'
import { hashSync, compareSync } from 'bcrypt-nodejs';
import { passwordReg } from '../validations/user.validations';
import jwt from 'jsonwebtoken';
import constants from '../config/constants';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema({
    email:{
        type : String,
        unique: true,
        required : [true, 'Email is required!'],
        validate: {
            validator(email){
                return validator.isEmail(email)
            },
            message: '{VALUE} is not valid email'
        }
    },
    userName: {
        type: String,
        required: [true, 'UserName is required!'],
        trim: true,
        unique: true,
      },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
        validate: {
          validator(password) {
            return passwordReg.test(password);
          },
          message: '{VALUE} is not a valid password!',
        },
      },
      resetPasswordOTP: {
        type: String
      },
      resetPasswordExpires: {
        type: Date
      },
      twitterProvider: {
        type: {
            id: String,
            token: String,
            tokenSecret : String
        },
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
    },

      
    { timestamps: true },
  );

  UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken!',
  });
  
  UserSchema.pre('save', function(next){
      if(this.isModified('password')){
          this.password = this._hashPassword(this.password);
      }
  
      return next();
  });
  
  UserSchema.methods = {
    _hashPassword(password) {
        return hashSync(password);
      },
      authenticateUser(password) {
        return compareSync(password, this.password);
      },
      createToken() {
        return jwt.sign(
          {
            _id: this._id,
          },
          constants.JWT_SECRET,
        );
      },
      toAuthJSON() {
        return {
          _id: this._id,
          userName: this.userName,
          token: `JWT ${this.createToken()}`,
        };
      },
      toJSON() {
        return {
          _id: this._id,
          userName: this.userName,
        };
      },
      toGoogleJSON() {
        return {
          _id: this._id,
          userName: this.userName,
          token: `JWT ${this.createToken()}`,
          socialAuthData : this.googleProvider
        };
      },
    };

    UserSchema.statics.upsertGoogleUser =  (accessToken, refreshToken, profile, cb) => {
      const that = this;
      return this.findOne({
          'googleProvider.id': profile.id
      }, async (err, user) => {
        console.log(user);
          // no user was found, lets create a new one
          if (!user) {
              let newUser = new that({
                  userName: profile.displayName,
                  email: profile.emails[0].value,
                  password: accessToken,
                  googleProvider: {
                      id: profile.id,
                      token: accessToken
                  }
              });

              await newUser.save((error, savedUser) => {
                  if (error) {
                    return cb(err, false);
                  }
                  return cb(error, savedUser);
              });
          }else{
              return cb(err, false);
          }
      });
  };

  UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
    const that = this;
    return this.findOne({
        'twitterProvider.id': profile.id
    }, (err, user) => {
        // no user was found, lets create a new one
        if (!user) {
            let newUser = new that({
                email: profile.emails[0].value,
                password : token,
                userName : profile.id,
                twitterProvider: {
                    id: profile.id,
                    token,
                    tokenSecret
                }
            });

            newUser.save((error, savedUser) => {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};


export default mongoose.model('User', UserSchema);