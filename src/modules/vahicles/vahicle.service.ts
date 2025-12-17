import { pool } from "../../config/db";

export const vehicleService ={
    // Create Vehicle 
    async createVehicle(vehicleData: {
        vehicle_name: string;
        type:string;
        registration_number: string;
        daily_rent_price: number;
        availability_status: string;
    }){
        const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = vehicleData;

        const result = await pool.query(
            `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [vehicle_name, type, registration_number, daily_rent_price, availability_status]
        );

        return result.rows[0]
    },

    // Get all vehicles
    async getAllVehicles(){
        const result = await pool.query('SELECT * FROM vehicles ORDER BY id');
        return result.rows;
    },

    // Get vehhicle by Id
    async getVehicleById(id:number){
        const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
        if(result.rows.length === 0){
             throw new Error('Vehicle not found');
        }
        return result.rows[0]
    },

    // Update vehicle
    async updateVehicle(id: number, updateData: any) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && value !== null) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `UPDATE vehicles SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    if(result.rows.length === 0){
        throw new Error('Vehicle not found');
    }
    return result.rows[0]
    },

    // Delete vehicle
    async deleteVehicle(id:number){
        // Check if vehicle has active bookings
        const bookingCheck = await pool.query(
            `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = $2`,
            [id, 'active']
        );

        if(bookingCheck.rows.length > 0){
            throw new Error('Cannot delete vehicle with active bookings');
        }

        const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);

        if(result.rows.length === 0){
            throw new Error('Vehicle not found');
        }
        return result.rows
    }
    
}