import express from'express';
import constants from '../config/constants';
import '../config/database';
import middlewaresConfig from '../config/middlewares'
import apiRoutes from '../routes'

const app = express();
const PORT = process.env.PORT || 3000;

middlewaresConfig(app);
apiRoutes(app);

app.get('/', (req,res) => {
    res.send('Hello World');
})

app.listen(PORT, err => {
    if(err){
        throw err;
    } else {
        console.log(`
      Server running on port: ${PORT}
      ---
      Running on ${process.env.NODE_ENV}
      ---
      Make something great
    `);
        
    }
})

export default app;
