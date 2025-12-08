import express, { NextFunction, Request, Response } from "express";
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

// logger middleware
const logger = (req:Request, res:Response, next:NextFunction)=>{
 console.log(`[${new Date().toISOString()}] ${req.method}${req.path}\n`);
   next()
}

initDB();



// parser
app.use(express.json());
// app.use(express.urlencoded());



app.get('/', logger, (req:Request, res:Response) => {
  res.send('Hello Next Level Developers')
})

// users CRUD
app.post('/users', async(req:Request, res:Response) => {
  const {name, email, password, phone, role} = req.body;

  try{
    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);
    
    // console.log(result.rows[0]);
    res.status(201).json({
      success: false,
      message: "Data Inserted successfully",
      data: result.rows[0]
    })
   
  }
  
  catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

})


// localhost:5000/users get
app.get("/users", async(req:Request, res:Response)=>{
    try{
      const result = await pool.query(`SELECT * FROM users`);

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows
      })
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message,
        details: err
      })
    }
})

// localhost:5000/users/:id get
app.get("/users/:id", async(req:Request, res:Response)=>{
  console.log(req.params.id);
  
  try{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    else{
      res.status(200).json({
        success:true,
        message: "User fetched successfully",
        data: result.rows[0]
      })
    }
    
  }catch(err:any){
    res.status(500).json({
        success: false,
        message: err.message,
      })
  }
})

// localhost:5000/users/:id put
app.put("/users/:id", async(req:Request, res:Response)=>{
  // console.log(req.params.id);
 const {name, email, password, phone, role} = req.body;

  try{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`, [name, email, password, phone, role, req.params.id]);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    else{
      res.status(200).json({
        success:true,
        message: "User updated successfully",
        data: result.rows[0]
      })
    }
    
  }catch(err:any){
    res.status(500).json({
        success: false,
        message: err.message,
      })
  }
});


// localhost:5000/users/:id DELETE
app.delete("/users/:id", async(req:Request, res:Response)=>{
  // console.log(req.params.id);
  
  try{
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

    console.log(result);
    

    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    else{
      res.status(200).json({
        success:true,
        message: "User deleted successfully",
        data: result.rows
      })
    }
    
  }catch(err:any){
    res.status(500).json({
        success: false,
        message: err.message,
      })
  }
})


app.use((req: Request, res:Response)=>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
