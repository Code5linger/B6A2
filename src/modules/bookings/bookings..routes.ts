import { Router } from 'express';
import { bookingsController } from './bookings.controller';

const router = Router();

//---Bookings---Get---All--------------------------------------------
router.get('/', bookingsController.getBookings);
//---Bookings---Get---One---------------------------------
router.get('/:id', bookingsController.getSelectedBooking);
//---Bookings---Create---One------------------------------
router.post('/', bookingsController.createBooking);
//---Bookings---Update---One------------
router.put('/:id', bookingsController.updateBooking);
//---Bookings---Delete---One------------
router.delete('/:id', bookingsController.deleteBooking);

export const bookingsRoute = router;
