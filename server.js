import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import initRoutes from './routes/web.routes'
import { MongoClient } from 'mongodb'
dotenv.config()

const app = express()
let app_path = __dirname
app.use(express.json())
app.use(express.static(path.join(app_path,'build')))
app.use(cors())


// Connect to MongoDB
MongoClient.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }
    console.log('Connected to MongoDB');
    app.locals.db = client.db('recipe');
});


initRoutes(app)
const errorHandler = (error,req,res,next)=>{
    let status = 500;
    let data = {
        message: 'Internal Server Error',
        original_error: error.message
    }
    res.status(status).json(data);    
}

app.use(errorHandler)

app.listen(process.env.APP_PORT,()=>{
    console.log("Server is listening on port",process.env.APP_PORT)
})