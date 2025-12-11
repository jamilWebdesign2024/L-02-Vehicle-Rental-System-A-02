import { pool } from "../../config/db";


// const createUser = async (payload: Record<string, unknown>)=>{

//     const {name, email, password, phone, role}= payload;
//     const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);

//     return result;
// }

// const getUser = async()=>{
//     const result = await pool.query(`SELECT * FROM users`);

//     return result;
// }

// const getSingleUser = async(id:string)=>{

//     const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])

//     return result;
// }

// const updateUser = async(name:string, email:string, password:string, phone:number, role:string, id:string)=>{
//     const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`, [name, email, password, phone, role, id]);

//     return result;
// }

// const deleteUser = async(id:string)=>{
//     const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

//     return result;
// }

// all users get
const getAllUser = async ()=>{
    const result = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id')

    return result.rows;
}


// get single user by ID
const getSingleUser = async(userId:number)=>{
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id = $1`, [userId])

    if(result.rows.length !== 1){
        throw new Error('User not found')
    }
    return result.rows[0]
}

// update a user by id
const updateUserById = async(userId: number, updateData:any)=>{
    const fields = [];
    const values = [];
    let paramCount =1;

    for(const [key, value] of Object.entries(updateData)){
        if(value !== undefined && value !== null && key !== 'password' && key !== 'id'){
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++
        }
    }
    if(fields.length === 0){
        throw new Error('No fields to update')
    }
    values.push(userId);

    const query = `UPDATE users SET ${fields.join(',')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, name, email, phone, role`;
    const result = await pool.query(query, values)

    if(result.rows.length === 0){
        throw new Error('User not found')
    }

    return result.rows[0]
}





export const userServices = {
    // createUser,
    getAllUser,
    getSingleUser, 
    updateUserById
}

