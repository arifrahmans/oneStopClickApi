const devConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-dev',
    JWT_SECRET: 'supersecretcak',
    JWT_SECRET_RESET: 'supersecretcakreset',
    EMAIL_ADDRESS: 'areefrahmans@gmail.com',
    EMAIL_PASSWORD: 'Yogya@2019!',
    googleAuth : {
        clientID : '921848937085-tr062vohkp907rrmplm9cfqjstrmo4ha.apps.googleusercontent.com',
        clientSecret : 'L7j75Y0eTL0Hx7e1jFo-ScFA',
        callbackURL : 'http://localhost:3000/api.v1/users/google/callback'
    },
    twitterAuth : {
        consumerKey : 'uIVsg7Z7Zl9qzbzgnescYEUsn',
        consumerSecret : '9gxHtbviWnDfoGI6JxeTmCOtUG5tkD57HGYo4mYqCRdNnqazNs',
        callbackURL : 'http://localhost:3000/auth/twitter/callback'
    }
};

const testConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-test',
    JWT_SECRET_RESET: 'supersecretcakreset',
    EMAIL_ADDRESS: 'areefrahmans@gmail.com',
    EMAIL_PASSWORD: 'Yogya@2019!',
    googleAuth : {
        clientID : '921848937085-tr062vohkp907rrmplm9cfqjstrmo4ha.apps.googleusercontent.com',
        clientSecret : 'L7j75Y0eTL0Hx7e1jFo-ScFA',
        callbackURL : 'http://localhost:3000/api.v1/users/google/callback'
    },
    twitterAuth : {
        consumerKey : 'uIVsg7Z7Zl9qzbzgnescYEUsn',
        consumerSecret : '9gxHtbviWnDfoGI6JxeTmCOtUG5tkD57HGYo4mYqCRdNnqazNs',
        callbackURL : 'http://localhost:3000/auth/twitter/callback'
    }
};

const prodConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-prod',
    JWT_SECRET_RESET: 'supersecretcakreset',
    EMAIL_ADDRESS: 'areefrahmans@gmail.com',
    EMAIL_PASSWORD: 'Yogya@2019!',
    googleAuth : {
        clientID : '921848937085-tr062vohkp907rrmplm9cfqjstrmo4ha.apps.googleusercontent.com',
        clientSecret : 'L7j75Y0eTL0Hx7e1jFo-ScFA',
        callbackURL : 'http://localhost:3000/api.v1/users/google/callback'
    },
    twitterAuth : {
        consumerKey : 'uIVsg7Z7Zl9qzbzgnescYEUsn',
        consumerSecret : '9gxHtbviWnDfoGI6JxeTmCOtUG5tkD57HGYo4mYqCRdNnqazNs',
        callbackURL : 'http://localhost:3000/auth/twitter/callback'
    }
};

const defaultConfig = {
    PORT: process.env.PORT || 3000
};

function envConfig(env){
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}

export default{
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV)
}