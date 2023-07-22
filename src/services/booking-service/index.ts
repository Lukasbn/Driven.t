import { forbiddenError, notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"

async function getBookingByUserId(userId: number){
    const result = await bookingRepository.getBookingByUserIdDB(userId)
    if(!result) throw notFoundError()
    return result
}
async function postBooking(userId:number,roomId:number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment) throw forbiddenError()
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) throw forbiddenError()
    if(ticket.status ==="RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel ){
        throw forbiddenError()
    }
    const room = await bookingRepository.getRoomById(roomId)
    if(!room) throw notFoundError()
    if(room.capacity === room._count.Booking) throw forbiddenError()
    const result  = await bookingRepository.postBookingDB(userId,roomId)
    return { bookingId: result.id }
}
async function putBooking(userId: number, roomId: number, bookingId:number){
    const booking = await bookingRepository.getBookingByUserIdDB(userId)
    if(!booking) throw forbiddenError()
    const room = await bookingRepository.getRoomById(roomId)
    if(!room) throw notFoundError()
    if(room.capacity === room._count.Booking) throw forbiddenError()
    const result = await bookingRepository.putBookingDB(roomId,bookingId)
    return { bookingId: result.id }
}

const bookingService = {
    getBookingByUserId,
    postBooking,
    putBooking
}

export default bookingService