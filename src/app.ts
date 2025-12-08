import express, { Request, Response } from 'express';
import initDB from './config/db';
import { usersRoute } from './modules/users/users..routes';
import { vehiclesRoute } from './modules/vehicles/vehicles..routes';
import { bookingsRoute } from './modules/bookings/bookings..routes';
import { authRoute } from './modules/auth/auth.routes';

const app = express();

//!---DB---PostgreSQL---Neon----------------------------------------
initDB();

//!---Middleware----------------------------------------------------
//*---Json---Parser--------------------
app.use(express.json());

//!---Routes--------------------------------------------------------
app.get('/', (req: Request, res: Response) => {
  // res.send('Hello!');
  res.status(200).json('Hello World!');
});

app.post('/', (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: 'O_o',
  });
});

//*---Users-------------------------------------------------------
app.use('/api/v1/users', usersRoute);
//*---Vehicles----------------------------------------------------------
app.use('/api/v1/vehicles', vehiclesRoute);
//*---Bookings----------------------------------------------------------
app.use('/api/v1/bookings', bookingsRoute);
//*---Auth--------------------------------------------------------------
app.use('/api/v1/auth', authRoute);
//*---Not---Found---Route----------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

export default app;
