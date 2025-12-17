import { Router } from "express";
import { vehicleController } from "./vahicle.controller";
import auth from "../../middleware/auth";

const router = Router();

// Public Routes
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getVehicleById);

// Admin only routes
router.post('/', auth('admin'), vehicleController.createVehicle);
router.put('/:vehicleId', auth('admin'), vehicleController.updateVehicle);
router.delete('/:vehicleId', auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoutes = router;