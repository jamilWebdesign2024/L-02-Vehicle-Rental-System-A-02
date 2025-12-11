import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = express.Router();

// app.use("/users", usersRoutes)

// routes -> controller -> service


router.get("/", userControllers.getUser);

// router.get("/:id", userControllers.getSingleUser)

router.put("/:userId", userControllers.updateUserById);

// router.delete("/:id", userControllers.deleteUser);



export const userRoutes = router;

