import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const result = await bookingService.getBookingByUserId(userId);
        res.send(result)
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body
    if(isNaN(roomId) || !roomId) return res.sendStatus(httpStatus.FORBIDDEN)
    try {
        const result = await bookingService.postBooking(userId,roomId)
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'ForbiddenError'){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
    }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
    const { bookingId } = req.params;
    const BID = Number(bookingId)
    if(isNaN(roomId) || !roomId || isNaN(BID) || !bookingId) return res.sendStatus(httpStatus.FORBIDDEN)
    try {
        const result = bookingService.putBooking(userId,roomId,BID);
        res.send(result)
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'ForbiddenError'){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
    }
}

