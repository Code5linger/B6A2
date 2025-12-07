import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';

const app = express();
const port = config.port;

//!---DB---PostgreSQL---Neon----------------------------------------
initDB();

//!---Middleware----------------------------------------------------
//*---Json---Parser--------------------
app.use(express.json());

//!---Routes--------------------------------------------------------
app.get('/', (req: Request, res: Response) => {
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
//---Users---Get---All--------------------------------------------
app.get('/users', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: 'Users Data Received ✔️',
      data: result.rows,
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Users---Get---One---------------------------------
app.get('/users/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Found✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Users---Create---One------------------------------
app.post('/users', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const { name, email, password, phone, role } = req.body;

  //---Sending---data---to---db------------------------
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, phone, role]
    );
    console.log(result.rows[0]);

    res.json({ message: 'User Created✔️' });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Users---Update---One------------
app.put('/users/:id', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const { name, email, password, phone, role } = req.body;
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`,
      [name, email, password, phone, role, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Users---Delete---One------------
app.delete('/users/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Deleted ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//*---Vehicles----------------------------------------------------------
//---Users---Get---All--------------------------------------------
app.get('/vehicles', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);

    res.status(200).json({
      success: true,
      message: 'Vehicles Data Received ✔️',
      data: result.rows,
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Get---One---------------------------------
app.get('/vehicles/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle Found✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Create---One------------------------------
app.post('/vehicles', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  //---Sending---data---to---db------------------------
  try {
    const result = await pool.query(
      `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );
    console.log(result.rows[0]);

    res.json({ message: 'Vehicle Created✔️' });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Update---One------------
app.put('/vehicles/:id', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicles not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicles Info Updated Successfully ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Delete---One------------
app.delete('/vehicles/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle Deleted ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//*---Bookings----------------------------------------------------------
//---Users---Get---All--------------------------------------------
app.get('/bookings', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM bookings`);

    res.status(200).json({
      success: true,
      message: 'Booking Data Received ✔️',
      data: result.rows,
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Get---One---------------------------------
app.get('/bookings/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking Found✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Create---One------------------------------
app.post('/bookings', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  //---Sending---data---to---db------------------------
  try {
    const result = await pool.query(
      `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
      ]
    );
    console.log(result.rows[0]);

    res.json({ message: 'Booking Successful ✔️' });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Update---One------------
app.put('/bookings/:id', async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(
      `UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5,status=$6 WHERE id=$7 RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicles not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicles Info Updated Successfully ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
//---Vehicles---Delete---One------------
app.delete('/bookings/:id', async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`DELETE FROM bookings WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking Deleted ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
});
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
