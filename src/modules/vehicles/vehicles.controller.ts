import { Request, Response } from 'express';
import { vehicleServices } from './vehicles.service';

const getVehicles = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await vehicleServices.getVehicles();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicles found',
        data: [],
      });
    }

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
};

const getSelectedVehicle = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await vehicleServices.getSelectedVehicle(
      req.params.id as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle retrieved successfully',
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
};

const createVehicle = async (req: Request, res: Response) => {
  //---Sending---data---to---db------------------------
  try {
    const result = await vehicleServices.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
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

const updateVehicle = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const payload = { ...req.body, id: req.params.id };
    // const result = await vehicleServices.updateVehicle(req.body);
    const result = await vehicleServices.updateVehicle(payload);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicles not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
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

const deleteVehicle = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await vehicleServices.deleteVehicle(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
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

export const vehiclesControllers = {
  getVehicles,
  getSelectedVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
