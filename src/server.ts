import express, { Request, Response } from "express";
import {Pool} from "pg";
import dotenv from "dotenv"
import path from "path"


dotenv.config({path: path.join(process.cwd(), ".env")})
const app = express()
const port = 5000;

// DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});

// const initDB = async()=>{
    
//     // users table
//     await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       email VARCHAR(150) NOT NULL UNIQUE,
//       password TEXT NOT NULL,
//       phone VARCHAR(15) NOT NULL,
//       role VARCHAR(50) NOT NULL DEFAULT 'customer'
//     )
//         `)


//     // vahicles table
//     await pool.query(`
//     CREATE TABLE IF NOT EXISTS vehicles (
//       id SERIAL PRIMARY KEY,
//       vehicle_name VARCHAR(255) NOT NULL,
//       type VARCHAR(50) NOT NULL,
//       registration_number VARCHAR(50) NOT NULL UNIQUE,
//       daily_rent_price DECIMAL(10, 2) NOT NULL,
//       availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
//     )
//         `)


//     // Bookings table
//     await pool.query(`
//     CREATE TABLE IF NOT EXISTS vehicles (
//       id SERIAL PRIMARY KEY,
//       vehicle_name VARCHAR(255) NOT NULL,
//       type VARCHAR(50) NOT NULL,
//       registration_number VARCHAR(50) NOT NULL UNIQUE,
//       daily_rent_price DECIMAL(10, 2) NOT NULL,
//       availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
//     )
//         `)
// };

const initDB = async () => {

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer'
    )
  `);

  // console.log("Database initialized and 'users' table created (if not exists).");

  // Vehicles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      registration_number VARCHAR(50) NOT NULL UNIQUE,
      daily_rent_price DECIMAL(10, 2) NOT NULL,
      availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
    )
  `);

  // console.log("'vehicles' table created (if not exists).");

  // Bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active'
    )
  `);

  // console.log("'bookings' table created (if not exists).");
};

initDB();



// parser
app.use(express.json());
// app.use(express.urlencoded());



app.get('/', (req:Request, res:Response) => {
  res.send('Hello Next Level Developers')
})

app.post('/', (req:Request, res:Response) => {
  console.log(req.body);
  
  res.status(201).json({
    success: true,
    message: "API is working"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
