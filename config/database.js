import mongoose, {
    Schema
} from 'mongoose';
import constants from './constants';

// Remove the warning with promise
mongoose.Promise = global.Promise;
mongoose.plugin(schema => {
    schema.options.usePushEach = true
});

// connect to the Db with the url provide
try {
    mongoose.connect(constants.MONGO_URL);
} catch (e) {
    mongoose.createConnection(constants.MONGO_URL);
}

mongoose.connection
    .once('open', () => console.log(`MongoDB Running`))
    .on('error', e => {
        throw e;
    })