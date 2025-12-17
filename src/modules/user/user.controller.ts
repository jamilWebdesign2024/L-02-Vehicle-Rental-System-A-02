import { Request, Response } from "express";
import { userServices } from "./user.service";

// Get all users  (Admin only)
const getAllUsers = async(req:Request, res:Response)=>{
    try{
      const result = await userServices.getAllUsers();

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
      })
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
};


// Update a user by Id (Admin or own profile)
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

// Delete a user by Id (Admin only)
const deleteUser = async(req:Request, res:Response)=>{
  const {userId}= req.params as {userId: string}
  

  try{
    const result = await userServices.deleteUserById(parseInt(userId));

    console.log(result);
    

    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    else{
      res.status(200).json({
        success:true,
        message: "User deleted successfully"
      })
    }
    
  }catch(err:any){
    res.status(400).json({
        success: false,
        message: 'Error deleting user from the database',
        error: err.message
      })
  }
}




export const userControllers = {
   getAllUsers,
   updateUserById,
   deleteUser
  }