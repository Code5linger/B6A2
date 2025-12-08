import { Request, Response } from 'express';
import { bookingServices } from './bookings.service';

interface UserPayload {
  id: number;
  role: string;
}

const getBookings = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as UserPayload; // Added by auth middleware

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { bookings, message } = await bookingServices.getBookings(
      currentUser
    );

    res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ success: false, message });
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
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking Found',
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
  try {
    const { booking, vehicle } = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...booking,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ success: false, message });
  }
};

interface UserPayload {
  id: number;
  role: string;
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const status = req.body.status as 'cancelled' | 'returned';
    const currentUser = req.user as UserPayload | undefined; // could be undefined

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Booking ID is required' });
    }

    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await bookingServices.updateBooking({
      id,
      status,
      currentUser,
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found ❌' });
    }

    const message =
      status === 'cancelled'
        ? 'Booking cancelled successfully'
        : 'Booking marked as returned. Vehicle is now available';

    res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ success: false, message });
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
