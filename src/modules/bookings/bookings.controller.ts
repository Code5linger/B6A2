import { Request, Response } from 'express';
import { pool } from '../../config/db';

const getBookings = async (req: Request, res: Response) => {
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
};

const getSelectedBooking = async (req: Request, res: Response) => {
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
};

const createBooking = async (req: Request, res: Response) => {
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
};

const updateBooking = async (req: Request, res: Response) => {
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
};

const deleteBooking = async (req: Request, res: Response) => {
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
};

export const bookingsController = {
  getBookings,
  getSelectedBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
