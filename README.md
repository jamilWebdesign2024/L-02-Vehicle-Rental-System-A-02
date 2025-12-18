# Vehicle Rental System API

**Live URL:** https://vehicle-rental-system-bay.vercel.app  
**GitHub Repository:** https://github.com/mdmhrz/vehicle-rental-system  
**Author:** Md. Mobarak Hossain Razu

A fully functional **Vehicle Rental Management Backend API** built with **Node.js + TypeScript**, **Express**, and **PostgreSQL**. Implements secure JWT authentication, role-based access control (Admin & Customer), vehicle inventory management, and smart booking system with automatic pricing and availability handling.

---

## Features Implemented

- User Registration & Login (JWT + bcrypt)
- Role-based Authorization (`admin` | `customer`)
- Full CRUD for **Vehicles**, **Users**, and **Bookings**
- Automatic total price calculation (`daily_rate × days`)
- Real-time vehicle availability status (`available` / `booked`)
- Booking cancellation (by customer) & return (by admin)
- Prevent deletion of users/vehicles with active bookings
- Clean modular architecture (controllers → services → routes)
- Raw PostgreSQL queries with proper constraints
- Deployed on Vercel (Serverless Node.js)

---

## Tech Stack

| Technology       | Purpose                     |
|------------------|-----------------------------|
| Node.js          | Runtime                     |
| TypeScript       | Type safety                 |
| Express          | Web framework               |
| PostgreSQL       | Database                    |
| bcryptjs         | Password hashing            |
| jsonwebtoken     | JWT authentication          |
| pg               | PostgreSQL client           |
| Vercel           | Serverless deployment       |

---

## Live API Base URL

```
https://vehicle-rental-system-bay.vercel.app/api/v1
```

Root (Landing Page): https://vehicle-rental-system-bay.vercel.app

---

## Project Structure

```bash
src/
├── app.ts                  # Express app setup
├── server.ts               # Server entry point
├── config/
│   ├── db.ts               # DB pool + table creation
│   └── index.ts            # Environment config
├── middleware/
│   └── auth.ts             # JWT verification + role guard
├── modules/
│   ├── auth/               # Signup / Signin
│   ├── users/              # User management
│   ├── vehicles/           # Vehicle CRUD (Admin only)
│   └── bookings/           # Booking creation & status update
└── types/
    └── index.d.ts          # Express Request.user typing
```

---


### 🌐 API Endpoints all together

| Method | Endpoint                        | Access            | Description                              |
|--------|---------------------------------|-------------------|------------------------------------------|
| POST   | `/auth/signup`                  | Public            | Register user                            |
| POST   | `/auth/signin`                  | Public            | Login & get JWT                          |
| POST   | `/vehicles`                     | Admin             | Add vehicle                              |
| GET    | `/vehicles`                     | Public            | List all vehicles                        |
| GET    | `/vehicles/:id`                 | Public            | Get single vehicle                       |
| PUT    | `/vehicles/:id`                 | Admin             | Update vehicle                           |
| DELETE | `/vehicles/:id`                 | Admin             | Delete vehicle (if no active booking)    |
| GET    | `/users`                        | Admin             | List all users                           |
| PUT    | `/users/:id`                    | Admin or Own      | Update profile/role                      |
| DELETE | `/users/:id`                    | Admin             | Delete user (if no active booking)       |
| POST   | `/bookings`                     | Customer/Admin    | Create booking (auto price & status)     |
| GET    | `/bookings`                     | Admin → all, Customer → own | View bookings                  |
| PUT    | `/bookings/:id`                 | Customer (cancel) / Admin (return) | Update status             |

---







## Authentication

All protected routes require the following header:

```http
Authorization: Bearer <your_jwt_token>
```

Token expires in **7 days**. Obtain the token via login.

### How to Send Payloads for Authentication Endpoints

Use tools like Postman, cURL, or any HTTP client. Examples use cURL for demonstration.

#### 1. User Registration (POST /api/v1/auth/signup)
- **Access:** Public
- **Payload Guide:** Send a JSON body with required fields. Email must be unique and lowercase. Password min 6 chars. Role must be 'admin' or 'customer'.
- **cURL Example:**
  ```
  curl -X POST https://vehicle-rental-system-bay.vercel.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "phone": "01712345678",
    "role": "customer"
  }'
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "01712345678",
      "role": "customer"
    }
  }
  ```

#### 2. User Login (POST /api/v1/auth/signin)
- **Access:** Public
- **Payload Guide:** Send JSON with email and password. Use the token in future requests.
- **cURL Example:**
  ```
  curl -X POST https://vehicle-rental-system-bay.vercel.app/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "role": "customer"
      }
    }
  }
  ```

---

## Vehicle Endpoints

### How to Send Payloads for Vehicle Endpoints

All admin-only endpoints require Authorization header.

#### 3. Create Vehicle (POST /api/v1/vehicles)
- **Access:** Admin only
- **Payload Guide:** Send JSON body. Registration number unique, price positive, status 'available' or 'booked'.
- **cURL Example:**
  ```
  curl -X POST https://vehicle-rental-system-bay.vercel.app/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 50,
    "availability_status": "available"
  }'
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Vehicle created successfully",
    "data": {
      "id": 1,
      "vehicle_name": "Toyota Camry 2024",
      "type": "car",
      "registration_number": "ABC-1234",
      "daily_rent_price": 50,
      "availability_status": "available"
    }
  }
  ```

#### 4. Get All Vehicles (GET /api/v1/vehicles)
- **Access:** Public
- **Payload Guide:** No body or headers needed.
- **cURL Example:**
  ```
  curl -X GET https://vehicle-rental-system-bay.vercel.app/api/v1/vehicles
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicles retrieved successfully",
    "data": [
      {
        "id": 1,
        "vehicle_name": "Toyota Camry 2024",
        "type": "car",
        "registration_number": "ABC-1234",
        "daily_rent_price": 50,
        "availability_status": "available"
      },
      {
        "id": 2,
        "vehicle_name": "Honda Civic 2023",
        "type": "car",
        "registration_number": "XYZ-5678",
        "daily_rent_price": 45,
        "availability_status": "available"
      }
    ]
  }
  ```
- **Empty List Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "No vehicles found",
    "data": []
  }
  ```

#### 5. Get Vehicle by ID (GET /api/v1/vehicles/:vehicleId)
- **Access:** Public
- **Payload Guide:** Replace :vehicleId with actual ID. No body.
- **cURL Example:**
  ```
  curl -X GET https://vehicle-rental-system-bay.vercel.app/api/v1/vehicles/2
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicle retrieved successfully",
    "data": {
      "id": 2,
      "vehicle_name": "Honda Civic 2023",
      "type": "car",
      "registration_number": "XYZ-5678",
      "daily_rent_price": 45,
      "availability_status": "available"
    }
  }
  ```

#### 6. Update Vehicle (PUT /api/v1/vehicles/:vehicleId)
- **Access:** Admin only
- **Payload Guide:** Send optional JSON fields. Replace :vehicleId.
- **cURL Example:**
  ```
  curl -X PUT https://vehicle-rental-system-bay.vercel.app/api/v1/vehicles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "vehicle_name": "Toyota Camry 2024 Premium",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 55,
    "availability_status": "available"
  }'
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicle updated successfully",
    "data": {
      "id": 1,
      "vehicle_name": "Toyota Camry 2024 Premium",
      "type": "car",
      "registration_number": "ABC-1234",
      "daily_rent_price": 55,
      "availability_status": "available"
    }
  }
  ```

#### 7. Delete Vehicle (DELETE /api/v1/vehicles/:vehicleId)
- **Access:** Admin only
- **Payload Guide:** Replace :vehicleId. No body. Fails if active bookings.
- **cURL Example:**
  ```
  curl -X DELETE https://vehicle-rental-system-bay.vercel.app/api/v1/vehicles/1 \
  -H "Authorization: Bearer <jwt_token>"
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicle deleted successfully"
  }
  ```

---

## User Endpoints

### How to Send Payloads for User Endpoints

Require Authorization for all.

#### 8. Get All Users (GET /api/v1/users)
- **Access:** Admin only
- **Payload Guide:** No body.
- **cURL Example:**
  ```
  curl -X GET https://vehicle-rental-system-bay.vercel.app/api/v1/users \
  -H "Authorization: Bearer <jwt_token>"
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "role": "customer"
      },
      {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com",
        "phone": "+0987654321",
        "role": "admin"
      }
    ]
  }
  ```

#### 9. Update User (PUT /api/v1/users/:userId)
- **Access:** Admin or Own Profile
- **Payload Guide:** Optional fields. Admin can change role. Replace :userId.
- **cURL Example:**
  ```
  curl -X PUT https://vehicle-rental-system-bay.vercel.app/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567899",
    "role": "admin"
  }'
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": 1,
      "name": "John Doe Updated",
      "email": "john.updated@example.com",
      "phone": "+1234567899",
      "role": "customer"
    }
  }
  ```

#### 10. Delete User (DELETE /api/v1/users/:userId)
- **Access:** Admin only
- **Payload Guide:** Replace :userId. No body. Fails if active bookings.
- **cURL Example:**
  ```
  curl -X DELETE https://vehicle-rental-system-bay.vercel.app/api/v1/users/1 \
  -H "Authorization: Bearer <jwt_token>"
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

---

## Booking Endpoints

### How to Send Payloads for Booking Endpoints

Require Authorization.

#### 11. Create Booking (POST /api/v1/bookings)
- **Access:** Customer or Admin
- **Payload Guide:** Send JSON. Validates availability, calculates price.
- **cURL Example:**
  ```
  curl -X POST https://vehicle-rental-system-bay.vercel.app/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20"
  }'
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "daily_rent_price": 45
      }
    }
  }
  ```

#### 12. Get All Bookings (GET /api/v1/bookings)
- **Access:** Role-based (Admin sees all, Customer sees own)
- **Payload Guide:** No body. Response varies by role.
- **cURL Example:**
  ```
  curl -X GET https://vehicle-rental-system-bay.vercel.app/api/v1/bookings \
  -H "Authorization: Bearer <jwt_token>"
  ```
- **Success Response (200 OK) - Admin View:**
  ```json
  {
    "success": true,
    "message": "Bookings retrieved successfully",
    "data": [
      {
        "id": 1,
        "customer_id": 1,
        "vehicle_id": 2,
        "rent_start_date": "2024-01-15",
        "rent_end_date": "2024-01-20",
        "total_price": 250,
        "status": "active",
        "customer": {
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "vehicle": {
          "vehicle_name": "Honda Civic 2023",
          "registration_number": "XYZ-5678"
        }
      }
    ]
  }
  ```
- **Success Response (200 OK) - Customer View:**
  ```json
  {
    "success": true,
    "message": "Your bookings retrieved successfully",
    "data": [
      {
        "id": 1,
        "vehicle_id": 2,
        "rent_start_date": "2024-01-15",
        "rent_end_date": "2024-01-20",
        "total_price": 250,
        "status": "active",
        "vehicle": {
          "vehicle_name": "Honda Civic 2023",
          "registration_number": "XYZ-5678",
          "type": "car"
        }
      }
    ]
  }
  ```

#### 13. Update Booking (PUT /api/v1/bookings/:bookingId)
- **Access:** Role-based
- **Payload Guide:** Send JSON with status. Customer: "cancelled" only. Admin: "returned" only. Replace :bookingId.
- **cURL Example (Customer Cancellation):**
  ```
  curl -X PUT https://vehicle-rental-system-bay.vercel.app/api/v1/bookings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "status": "cancelled"
  }'
  ```
- **Success Response (200 OK) - Cancelled:**
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "cancelled"
    }
  }
  ```
- **cURL Example (Admin Return):**
  ```
  curl -X PUT https://vehicle-rental-system-bay.vercel.app/api/v1/bookings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "status": "returned"
  }'
  ```
- **Success Response (200 OK) - Returned:**
  ```json
  {
    "success": true,
    "message": "Booking marked as returned. Vehicle is now available",
    "data": {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "returned",
      "vehicle": {
        "availability_status": "available"
      }
    }
  }
  ```

---


## Business Logic Notes

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

---

## Database Tables (Auto-created)

```sql
users          → id, name, email(unique), password, phone, role
vehicles       → id, vehicle_name, type, registration_number(unique), daily_rent_price, availability_status
bookings       → id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
```

---

## Environment Variables (`.env`)

```env
CONNECTION_STRING=postgresql://USER:PASSWORD@HOST:5432/DBNAME
PORT=5000
JWT_SECRET=your-very-strong-secret-key-here
```

---

## Local Development

```bash
git clone https://github.com/mdmhrz/vehicle-rental-system.git
cd vehicle-rental-system

npm install

cp .env.example .env    # Then fill your PostgreSQL URL & JWT secret

npm run dev             # Runs with tsx + auto-restart
```

Server runs at: `http://localhost:5000`

---

## Deployment

Deployed on **Vercel** as a serverless Node.js function  
Zero configuration | Auto-scaling | Global CDN

---

## Sample Admin Account (For Testing)

1. Register a user with `"role": "admin"`  
2. Use that account to access admin-only based routes

---

---

**Made with passion by Md. Mobarak Hossain Razu**
---
**I would be happy if you give me a star to this repository**