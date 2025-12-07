import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { usersRoute } from './modules/users/users..routes';
import { vehiclesRoute } from './modules/vehicles/vehicles..routes';
import { bookingsRoute } from './modules/bookings/bookings..routes';
import { authRoute } from './modules/auth/auth.routes';

const app = express();
const port = config.port;

//!---DB---PostgreSQL---Neon----------------------------------------
initDB();

//!---Middleware----------------------------------------------------
//*---Json---Parser--------------------
app.use(express.json());

//!---Routes--------------------------------------------------------
app.get('/', logger, (req: Request, res: Response) => {
  res.status(200).json('Hello World!');
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: 'O_o',
  });
});

//*---Users-------------------------------------------------------
app.use('/users', usersRoute);
//*---Vehicles----------------------------------------------------------
app.use('/vehicles', vehiclesRoute);
//*---Bookings----------------------------------------------------------
app.use('/bookings', bookingsRoute);
//*---Auth--------------------------------------------------------------
app.use('/auth', authRoute);
//*---Not---Found---Route----------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
