import express, { Request, Response } from 'express';
import { Pool } from 'pg';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const app = express();
const port = 8000;

//!---DB---PostgreSQL---Neon----------------------------------------
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});
//*---Tables---------------------------
const initDB = async () => {
  //*---Users---Table---
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE CHECK (email = LOWER(email)),
            password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
        )`);
  //*---Vehicles---Table---
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(15) NOT NULL UNIQUE,
            daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked' ))
        )`);
  //*---Bookings---Table---
  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
            total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned' ))
        )`);
};

initDB();

//!---Middleware----------------------------------------------------
//*---Json---Parser--------------------
app.use(express.json());

//!---Routes--------------------------------------------------------
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: 'O_o',
  });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
