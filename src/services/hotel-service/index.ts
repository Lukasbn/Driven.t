import { notFoundError, paymentRequiredError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelRepository from "@/repositories/hotel-repository"
import ticketsRepository from "@/repositories/tickets-repository"

export async function getHotelService(id: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(id)
    if(!enrollment) throw notFoundError

    const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) throw notFoundError

    if(ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.createdAt){
        throw paymentRequiredError
    }

    const hotels = await hotelRepository.getHotelsDB()
    return hotels
}

export async function getHotelByIdService(id:number, HID:number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(id)
    if(!enrollment) throw notFoundError

    const ticket  = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) throw notFoundError

    if(ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.createdAt){
        throw paymentRequiredError
    }

    const result = hotelRepository.getHotelByIdDB(HID)

    if(!result) throw notFoundError
    return result
}


export default { getHotelService, getHotelByIdService }