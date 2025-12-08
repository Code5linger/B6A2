import { Router } from 'express';
import { vehiclesControllers } from './vehicles.controller';
import auth from '../../middleware/auth';

const router = Router();

//---Users---Get---All--------------------------------------------
router.get('/', vehiclesControllers.getVehicles);
//---Vehicles---Get---One---------------------------------
router.get('/:id', vehiclesControllers.getSelectedVehicle);
//---Vehicles---Create---One------------------------------
router.post('/', auth('admin'), vehiclesControllers.createVehicle);
//---Vehicles---Update---One------------
router.put('/:id', auth('admin'), vehiclesControllers.updateVehicle);
//---Vehicles---Delete---One------------
router.delete('/:id', auth('admin'), vehiclesControllers.deleteVehicle);

export const vehiclesRoute = router;
