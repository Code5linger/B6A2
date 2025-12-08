import { Router } from 'express';
import { userControllers } from './users.controller';
import auth from '../../middleware/auth';

const router = Router();

//---Users---Get---All--------------------------------------------
router.get('/', auth('admin', 'customer'), userControllers.getUsers);
//---Users---Get---One--------------------------------------------
router.get('/:id', auth('admin', 'customer'), userControllers.getSelectedUser);
//---Users---Create---One-----------------------------------------
router.post('/', auth('admin', 'customer'), userControllers.createNewUser);
//---Users---Update---One-----------------------------------------
router.put('/:id', auth('admin', 'customer'), userControllers.updateUser);
//---Users---Delete---One-----------------------------------------
router.delete('/:id', auth('admin', 'customer'), userControllers.deleteUser);

export const usersRoute = router;

/**
 * POST /api/v1/auth/signup
 * POST /api/v1/auth/signin
 * PUT /api/v1/users/:userId
 * DELETE /api/v1/users/:userId
 *
 *
 */

/***
 * POST /api/v1/vehicles
 * GET /api/v1/vehicles
 * GET /api/v1/vehicles/:vehicleId
 * PUT /api/v1/vehicles/:vehicleId
 * DELETE /api/v1/vehicles/:vehicleId
 *
 */

/**
 * POST /api/v1/bookings
 * GET /api/v1/bookings
 * PUT /api/v1/bookings/:bookingId
 *
 */
