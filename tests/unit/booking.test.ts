import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import bookingService from "@/services/booking-service";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, getBookingFactory, getEnrollmentWithAddress, getFullRoom, getTicketWithHotelBoolean} from "../factories";
import ticketsRepository from "@/repositories/tickets-repository";

describe("bookingService get test suit", ()=>{
    it("should throw notFoundError when there is no booking",async ()=>{
        jest.spyOn(bookingRepository, "getBookingByUserIdDB").mockImplementationOnce(()=>{return null})
        const promise = bookingService.getBookingByUserId(faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!'
        })
    })
})

describe("bookingService post test suit", ()=>{
    it("should throw forbiddenError when there is no enrollment", async ()=>{
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce(()=>{return null})

        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })

    it("should throw forbiddenError when there is no ticket", async ()=>{
        const addres = getEnrollmentWithAddress()
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any =>{ return addres })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce(()=>{ return null })
        
        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })

    it("should throw forbiddenError when the ticketType is remote", async ()=>{
        const addres = getEnrollmentWithAddress()
        const ticket = getTicketWithHotelBoolean(faker.datatype.number(), false, "PAID")
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any =>{ return addres })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any =>{ return ticket })
        
        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })

    it("should throw forbiddenError when the ticket is not paid", async ()=>{
        const addres = getEnrollmentWithAddress()
        const ticket = getTicketWithHotelBoolean(faker.datatype.number(), true, "RESERVED")
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any =>{ return addres })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any =>{ return ticket })
        
        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })
    
    it("should throw notFoundErrror when the room is not found", async ()=>{
        const addres = getEnrollmentWithAddress()
        const ticket = getTicketWithHotelBoolean(faker.datatype.number(), true,"PAID")
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any =>{ return addres })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any =>{ return ticket })
        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce(()=>{return null})
        
        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!'
        })
    })

    it("should throw forbiddenError when the room capacity is full", async ()=>{
        const addres = getEnrollmentWithAddress()
        const ticket = getTicketWithHotelBoolean(faker.datatype.number(), true,"PAID")
        const room = getFullRoom()
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any =>{ return addres })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any =>{ return ticket })
        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce(():any =>{return room})
        
        const promise = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })
    
})

describe("bookingService put test suit", ()=>{
    it("should throw forbiddenError when there is no booking",async ()=>{
        jest.spyOn(bookingRepository, "getBookingByUserIdDB").mockImplementationOnce(()=>{return null})
        
        const promise = bookingService.putBooking(faker.datatype.number(),faker.datatype.number(),faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })

    it("should throw notFoundError when the room is not found",async ()=>{
        const booking = getBookingFactory()
        jest.spyOn(bookingRepository, "getBookingByUserIdDB").mockImplementationOnce(():any=>{return booking})
        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce(()=>{return null})
        
        const promise = bookingService.putBooking(faker.datatype.number(),faker.datatype.number(),faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!'
        })
    })

    it("should throw forbiddenError when the room capacity is full",async ()=>{
        const booking = getBookingFactory()
        const room = getFullRoom()
        jest.spyOn(bookingRepository, "getBookingByUserIdDB").mockImplementationOnce(():any=>{return booking})
        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce(():any =>{return room})
        
        const promise = bookingService.putBooking(faker.datatype.number(),faker.datatype.number(),faker.datatype.number())

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'request not accepted!'
        })
    })
})

