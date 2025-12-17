import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/users", usersRoutes)

// routes -> controller -> service

// Get all users (Admin Only)
router.get('/', auth('admin'), userControllers.getAllUsers);

// Update a user by ID (Admin or own profile)
router.put('/:userId', auth(), userControllers.updateUserById);

// Delete a user by ID (Admin Only)
router.delete('/:userId', auth('admin'), userControllers.deleteUser)



export const userRoutes = router;

