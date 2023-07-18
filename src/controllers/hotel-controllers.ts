import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { getHotelByIdService, getHotelService } from '@/services/hotel-service';

export async function getHotels(req:AuthenticatedRequest,res:Response){
    const id = req.userId;
    try{
        const result = await getHotelService(id)
        res.send(result)
    } catch(error){
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }

        if(error.name === "PaymentRequired"){
            return res.status(402).send("You have to pay the ticket to access this!")
        }

        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response){
    const id = req.userId;
    const { hotelId } = req.params
    const HID = Number(hotelId)
    try{
        const result = await getHotelByIdService(id,HID)
        res.send(result)
    }catch(error){
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }

        if(error.name === "PaymentRequired"){
            return res.status(402).send("You have to pay the ticket to access this!")
        }

        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
    
}