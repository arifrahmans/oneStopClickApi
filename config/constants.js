const devConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-dev',
    JWT_SECRET: 'supersecretcak'
};

const testConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-test',
    JWT_SECRET: 'supersecretcak'
};

const prodConfig = {
    MONGO_URL: 'mongodb://localhost:27017/oneStopClick-prod',
    JWT_SECRET: 'supersecretcak'
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