import { Router } from 'express';
import { vehiclesControllers } from './vehicles.controller';

const router = Router();

//---Users---Get---All--------------------------------------------
router.get('/', vehiclesControllers.getVehicles);
//---Vehicles---Get---One---------------------------------
router.get('/:id', vehiclesControllers.getSelectedVehicle);
//---Vehicles---Create---One------------------------------
router.post('/', vehiclesControllers.createVehicle);
//---Vehicles---Update---One------------
router.put('/:id', vehiclesControllers.updateVehicle);
//---Vehicles---Delete---One------------
router.delete('/:id', vehiclesControllers.deleteVehicle);

export const vehiclesRoute = router;
