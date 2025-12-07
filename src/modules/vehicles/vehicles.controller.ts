import { Request, Response } from 'express';
import { pool } from '../../config/db';

const getVehicles = async (req: Request, res: Response) => {
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
};

const getSelectedVehicle = async (req: Request, res: Response) => {
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
};

const createVehicle = async (req: Request, res: Response) => {
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
};

const updateVehicle = async (req: Request, res: Response) => {
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
};

const deleteVehicle = async (req: Request, res: Response) => {
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
};

export const vehiclesControllers = {
  getVehicles,
  getSelectedVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
