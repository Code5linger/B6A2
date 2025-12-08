import { Router } from 'express';
import { bookingsController } from './bookings.controller';
import auth from '../../middleware/auth';

const router = Router();

//---Bookings---Get---All--------------------------------------------
router.get('/', auth('admin', 'customer'), bookingsController.getBookings);
//---Bookings---Get---One---------------------------------
router.get(
  '/:id',
  auth('admin', 'customer'),
  bookingsController.getSelectedBooking
);
//---Bookings---Create---One------------------------------
router.post('/', auth('admin', 'customer'), bookingsController.createBooking);
//---Bookings---Update---One------------
router.put('/:id', auth('admin', 'customer'), bookingsController.updateBooking);
//---Bookings---Delete---One------------
router.delete(
  '/:id',
  auth('admin', 'customer'),
  bookingsController.deleteBooking
);

export const bookingsRoute = router;
