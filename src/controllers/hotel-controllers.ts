import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { getHotelService } from '@/services/hotel-service';

export async function getHotels(req:AuthenticatedRequest,res:Response){
    const id = req.userId;
    try{
        const result = await getHotelService(id)
        res.send(result)
    } catch(error){
        if(error.name === "NotFoundError"){
            return res.status(404).send("Not Found")
        }

        if(error.name === "PaymentRequired"){
            return res.status(402).send("You have to pay the ticket to access this!")
        }

        return res.send(httpStatus.INTERNAL_SERVER_ERROR)
    }
}