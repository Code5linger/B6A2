import { pool } from '../../config/db';

interface UserPayload {
  id: number;
  role: string;
}

const getBookings = async (currentUser: UserPayload) => {
  if (currentUser.role === 'admin') {
    const result = await pool.query(`
      SELECT 
        b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object('name', u.name, 'email', u.email) AS customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
      ORDER BY b.id
    `);
    return {
      bookings: result.rows,
      message: 'Bookings retrieved successfully',
    };
  } else {
    const result = await pool.query(
      `
      SELECT 
        b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
      FROM bookings b
      JOIN vehicles v ON v.id = b.vehicle_id
      WHERE b.customer_id=$1
      ORDER BY b.id
    `,
      [currentUser.id]
    );

    return {
      bookings: result.rows,
      message: 'Your bookings retrieved successfully',
    };
  }
};

const getSelectedBooking = async (id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  return result;
};

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // 1️⃣ Fetch vehicle info
  const vehicleResult = await pool.query(
    'SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1',
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== 'available') {
    throw new Error('Vehicle is not available for booking');
  }

  // 2️⃣ Calculate total price
  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // number of days

  if (diffDays <= 0) {
    throw new Error('rent_end_date must be after rent_start_date');
  }

  const total_price = vehicle.daily_rent_price * diffDays;

  // 3️⃣ Insert booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      'active',
    ]
  );

  // 4️⃣ Update vehicle availability
  await pool.query('UPDATE vehicles SET availability_status=$1 WHERE id=$2', [
    'booked',
    vehicle_id,
  ]);

  return { booking: bookingResult.rows[0], vehicle };
};

interface UserPayload {
  id: number;
  role: string;
}

interface UpdateBookingPayload {
  id: string; // booking ID from req.params.id
  status: 'cancelled' | 'returned';
  currentUser: UserPayload;
}

const updateBooking = async ({
  id,
  status,
  currentUser,
}: UpdateBookingPayload) => {
  // Fetch existing booking
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    id,
  ]);
  const booking = bookingRes.rows[0];
  if (!booking) return null;

  // Role-based access control
  if (currentUser.role !== 'admin' && booking.customer_id !== currentUser.id) {
    throw new Error('Forbidden: You cannot update this booking');
  }

  // Customers can only cancel
  if (currentUser.role !== 'admin' && status !== 'cancelled') {
    throw new Error('Forbidden: Customers can only cancel bookings');
  }

  // Admin can mark returned
  if (currentUser.role === 'admin' && status === 'returned') {
    await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [status, id]);
    const vehicleRes = await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING availability_status`,
      [booking.vehicle_id]
    );

    return {
      ...booking,
      status,
      vehicle: vehicleRes.rows[0],
    };
  }

  // Regular update for cancellation
  const updatedRes = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );

  return updatedRes.rows[0];
};

//-----------------------------------------------------------------
const deleteBooking = async (id: string) => {
  const result = await pool.query(`DELETE FROM bookings WHERE id=$1`, [id]);
  return result;
};

export const bookingServices = {
  getBookings,
  getSelectedBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
