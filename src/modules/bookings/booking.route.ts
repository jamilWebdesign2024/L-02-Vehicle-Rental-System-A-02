import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = Router();


// Protected routes - requires authentication
router.post('/', auth(), bookingController.createBooking);
router.get('/', auth(), bookingController.getBookings);
router.put('/:bookingId', auth(), bookingController.updateBooking);

export const bookingRoutes = router;