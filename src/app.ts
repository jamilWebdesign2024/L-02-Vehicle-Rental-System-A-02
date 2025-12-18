import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vahicles/vahicle.route";
import { bookingRoutes } from "./modules/bookings/booking.route";
import { authRoutes } from "./modules/auth/auth.route";
import path from "path"



const app = express();


// parser
app.use(express.json());
// app.use(express.urlencoded());



// intializing DB
initDB().catch(err=>console.error('Db initialization error', err));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send(path.join(__dirname, "..", "public", "index.html"))
})




app.get('/', logger, (req:Request, res:Response) => {
  res.send('Vahicle Rental System is Running')
});

app.get('/api/v1', logger, (req: Request, res: Response) => {
  res.send('Vehicle Rental System Server is running!')
})

// Authentication
app.use("/api/v1/auth", authRoutes)

// User Routes
app.use('/api/v1/users', userRoutes);

// Vehicle Routes
app.use('/api/v1/vehicles', vehicleRoutes);

// Booking Routes
app.use('/api/v1/bookings', bookingRoutes);












app.use((req: Request, res:Response)=>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})



export default app;