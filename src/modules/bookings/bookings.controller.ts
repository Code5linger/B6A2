import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { bookingServices } from './bookings.service';

const getBookings = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await bookingServices.getBookings();

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
    const result = await bookingServices.getSelectedBooking(
      req.params.id as string
    );

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
    const result = await bookingServices.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
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
    const result = await bookingServices.updateBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      req.params.id as string
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
    const result = await bookingServices.deleteBooking(req.params.id as string);

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
