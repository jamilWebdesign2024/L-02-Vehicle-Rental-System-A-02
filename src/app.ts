import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";




const app = express();


// parser
app.use(express.json());
// app.use(express.urlencoded());



// intializing DB
initDB().catch(err=>console.error('Db initialization error', err));








app.get('/', logger, (req:Request, res:Response) => {
  res.send('Vahicle Rental System is Running')
});

app.get('/api/v1', logger, (req: Request, res: Response) => {
  res.send('Wow😲Vehicle Rental System Server is running!')
})

// users CRUD
app.use("/api/v1/users", userRoutes)













app.use((req: Request, res:Response)=>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})



export default app;