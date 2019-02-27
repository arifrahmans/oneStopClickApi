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
      favorites: {
        posts: [{
          type: Schema.Types.ObjectId,
          ref: 'Post'
        }]
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
    };


export default mongoose.model('User', UserSchema);