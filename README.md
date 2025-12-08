## 🔐 Authentication & Authorization

### User Roles

- **Admin** - Full system access to manage vehicles, users and all bookings
- **Customer** - Can register, view vehicles, create/manage own bookings

### Authentication Flow

2. User login via `/api/v1/auth/signin` and receives a JWT (JSON Web Token)
3. Protected endpoints require token in header: `Authorization: Bearer <token>`
4. Validates the token and checks user permissions
5. Access granted if authorized, otherwise returns 401 (Unauthorized) or 403 (Forbidden)

---

## 🌐 API Endpoints

> 📖 **For detailed request/response specifications, see the [API Reference](API_REFERENCE.md)**

> ⚠️ **IMPORTANT:** All API endpoint implementations **MUST** exactly match the specifications defined in **[API Reference](API_REFERENCE.md)**. This includes:
>
> - Exact URL patterns (e.g., `/api/v1/vehicles/:vehicleId`)
> - Request body structure and field names
> - Response format and data structure

### Authentication

| Method | Endpoint              | Access | Description                 |
| ------ | --------------------- | ------ | --------------------------- |
| POST   | `/api/v1/auth/signup` | Public | Register new user account   |
| POST   | `/api/v1/auth/signin` | Public | Login and receive JWT token |

---

### Vehicles

| Method | Endpoint                      | Access     | Description                                                                             |
| ------ | ----------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| POST   | `/api/v1/vehicles`            | Admin only | Add new vehicle with name, type, registration, daily rent price and availability status |
| GET    | `/api/v1/vehicles`            | Public     | View all vehicles in the system                                                         |
| GET    | `/api/v1/vehicles/:vehicleId` | Public     | View specific vehicle details                                                           |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details, daily rent price or availability status                         |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist)                                       |

---

### Users

| Method | Endpoint                | Access       | Description                                                                   |
| ------ | ----------------------- | ------------ | ----------------------------------------------------------------------------- |
| GET    | `/api/v1/users`         | Admin only   | View all users in the system                                                  |
| PUT    | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin only   | Delete user (only if no active bookings exist)                                |

---

### Bookings

| Method | Endpoint                      | Access            | Description                                                                                                                                                         |
| ------ | ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/bookings`            | Customer or Admin | Create booking with start/end dates<br>• Validates vehicle availability<br>• Calculates total price (daily rate × duration)<br>• Updates vehicle status to "booked" |
| GET    | `/api/v1/bookings`            | Role-based        | Admin: View all bookings<br>Customer: View own bookings only                                                                                                        |
| PUT    | `/api/v1/bookings/:bookingId` | Role-based        | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |

---

## 📚 Additional Resources

- **[API Reference](API_REFERENCE.md)** - Detailed endpoint documentation with request/response examples
- **[Submission Guide](SUBMISSION_GUIDE.md)** - Assignment submission requirements and deadlines

---

## 📝 Common Response Patterns

### Standard Success Response Structure

```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

### Standard Error Response Structure

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error description"
}
```

### HTTP Status Codes Used

| Code | Meaning               | Usage                                    |
| ---- | --------------------- | ---------------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE              |
| 201  | Created               | Successful POST (resource created)       |
| 400  | Bad Request           | Validation errors, invalid input         |
| 401  | Unauthorized          | Missing or invalid authentication token  |
| 403  | Forbidden             | Valid token but insufficient permissions |
| 404  | Not Found             | Resource doesn't exist                   |
| 500  | Internal Server Error | Unexpected server errors                 |

---

## 🔒 Authentication Header Format

All protected endpoints require the following header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💡 Business Logic Notes

### Booking Price Calculation

```
total_price = daily_rent_price × number_of_days
number_of_days = rent_end_date - rent_start_date
```

### Vehicle Availability Updates

- When booking is created → Vehicle status changes to `"booked"`
- When booking is marked as `"returned"` → Vehicle status changes to `"available"`
- When booking is `"cancelled"` → Vehicle status changes to `"available"`

### Auto-Return Logic

- System automatically marks bookings as `"returned"` when `rent_end_date` has passed
- Vehicle availability status is updated accordingly

### Deletion Constraints

- Users cannot be deleted if they have active bookings
- Vehicles cannot be deleted if they have active bookings
- Active bookings = bookings with status `"active"`
