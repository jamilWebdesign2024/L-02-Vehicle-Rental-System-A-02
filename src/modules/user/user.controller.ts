import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

// const createUser = async(req:Request, res:Response) => {
//   // const {name, email, password, phone, role} = req.body;

//   try{
//     const result = await userServices.createUser(req.body);
    
//     // console.log(result.rows[0]);
//     res.status(201).json({
//       success: false,
//       message: "Data Inserted successfully",
//       data: result.rows[0]
//     })
   
//   }
  
//   catch(err:any){
//     res.status(500).json({
//       success: false,
//       message: err.message
//     })
//   }

// }

const getUser = async(req:Request, res:Response)=>{
    try{
      const result = await userServices.getAllUser();

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
      })
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message,
        details: err
      })
    }
};



const updateUserById = async(req:Request, res:Response)=>{
  // console.log(req.params.id);
  const {userId} = req.params as {userId:string};
   const { user: { id: currentUserId, role } } = req as any;
  // const parseIntUserId = parseInt(userId)

  try{
    // Check authorization - admin or own profile
    if(role !== 'admin' && currentUserId !== parseInt(userId)){
      return  res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: 'Cannot update another user\'s profile'
      });
    }
    const result = await userServices.updateUserById(parseInt(userId), req.body);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result
    });
  }
  catch(err: any){
      res.status(400).json({
        success: false,
        message: 'Error updating user in the DB',
        error: err.message
      });
  }
}


// const getSingleUser = async(req:Request, res:Response)=>{
//   console.log(req.params.id);
  
//   try{
//     const result = await userServices.getSingleUser(req.params.id as string);

//     if(result.rows.length === 0){
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }
//     else{
//       res.status(200).json({
//         success:true,
//         message: "User fetched successfully",
//         data: result.rows[0]
//       })
//     }
    
//   }catch(err:any){
//     res.status(500).json({
//         success: false,
//         message: err.message,
//       })
//   }
// }




// const deleteUser = async(req:Request, res:Response)=>{
//   // console.log(req.params.id);
  
//   try{
//     const result = await userServices.deleteUser(req.params.id as string);

//     console.log(result);
    

//     if(result.rowCount === 0){
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }
//     else{
//       res.status(200).json({
//         success:true,
//         message: "User deleted successfully",
//         data: result.rows
//       })
//     }
    
//   }catch(err:any){
//     res.status(500).json({
//         success: false,
//         message: err.message,
//       })
//   }
// }




export const userControllers = {
    updateUserById,
    getUser,
  }