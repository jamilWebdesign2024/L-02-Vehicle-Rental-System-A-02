import { pool } from "../../config/db";

export const bookingService = {
    // Create Booking
    async createBooking(bookingData: {
        customer_id:number;
        vehicle_id:number;
        rent_start_date: string;
        rent_end_date: string
    }){
        const {customer_id, vehicle_id, rent_start_date, rent_end_date} = bookingData;

        // Validate dates
        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date);

        if(endDate <= startDate){
            throw new Error('End date must be after start date');
        }

        // Check vehicle availability
        const vehicleResult = await pool.query(
            `SELECT * FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );

        if(vehicleResult.rows.length === 0){
            throw new Error('Vehicle not found'); 
        }
        const vehicle = vehicleResult.rows[0];

        if(vehicle.availability_status !== 'available'){
            throw new Error('Vehicle is not available for booking');
        }

        // Calculate number of days and total price
        const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = numberOfDays * parseFloat(vehicle.daily_rent_price);

        // Create Booking
        const bookingResult = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rend_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, 'active']
        );

        // Update vehicle availability status 
        await pool.query(
            `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
            ['booked', vehicle_id]
        );

        const booking = bookingResult.rows[0];

        // Return Booking with vehicle details
        return {
            ...booking,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        };
    },

    // Get all bookings (admin sees all, customer sees their own)
    async getBookings(userId:number, userRole: string, isAdmin: boolean = false){
        let query;
        let params: any[] = [];

        if(isAdmin){
            query = `
            SELECT 
            b.*,
            c.name as customer_name,
            c.email as customer_email,
            v.vehicle_name,
            v.registration_number
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.id
            `;
        }else{
            // Customer sees only their bookings 
            query = `
            SELECT
                b.id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                v.vehicle_name,
                v.registration_number,
                v.type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE B.customer_id = $1
            ORDER BY b.id
            `;
            params.push(userId)
        }
        const result = await pool.query(query, params);
        return result.rows;
    },


    // Get Booking by ID
    async getBookingById(id:number){
        const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
        if(result.rows.length === 0){
             throw new Error('Booking not found');
        }
        return result.rows[0]
    },

    // Update booking status 
    async updateBookin
}