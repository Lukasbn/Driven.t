import { Router} from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelById, getHotels } from "@/controllers/hotel-controllers";

const hotelsRouters = Router()

hotelsRouters.use(authenticateToken)
hotelsRouters.get("/", getHotels)
hotelsRouters.get('/:hotelId', getHotelById)

export {hotelsRouters}