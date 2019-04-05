import crypto from 'crypto';
import constants from '../config/constants';

class Token{

    static generateToken(){
        return crypto.randomBytes(20).toString('hex');
    }

    static tokenValidTime(){
        return Date.now() + 360000;
    }

    static checkToken(token){

    }

}

export default Token;