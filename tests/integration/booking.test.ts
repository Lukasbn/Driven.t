import app, { init } from "@/app"
import supertest from "supertest"
import { cleanDb, generateValidToken } from "../helpers";
import { createBooking, createEnrollmentWithAddress, createTicket, createTicketTypeRemoteBollean, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoomForHotel } from "../factories/hotels-factory";
import faker from "@faker-js/faker";

const server = supertest(app)

beforeAll(async () => {
    await init();
    await cleanDb()
})

beforeEach(async () => {
    await cleanDb()
})

describe("GET /booking",()=>{
    it("should respond with 404 when there is no booking",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404)
    })
    it("should respond with 200 and the correct body on the get/booking endpoint",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)
        const booking = await createBooking(user.id,room.id)

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            id: booking.id,
            Room:{
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                hotelId: room.hotelId,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString()
            }
        })
    })
})

describe("POST /booking",()=>{
    it("should respond with 403 when the roomId is invalid",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)

        const response = await server.post('/booking').send({roomId: "batata"}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403)
    })

    it("should respond with 404 when there is no room",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()

        const response = await server.post('/booking').send({roomId:faker.datatype.number()}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404)
    })

    it("should respond with 403 when there is no enrollment for the user",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)

        const response = await server.post('/booking').send({roomId:room.id}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403)
    })

    it("should respond with 200 and the correct body when posting a booking",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)

        const response = await server.post('/booking').send({roomId:room.id}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200)
        expect(response.body).toEqual({bookingId: expect.any(Number)})
    })
})

describe("PUT /booking",()=>{
    it("should respond with 403 when roomId is invalid",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)
        const room2 = await createRoomForHotel(hotel.id)
        const booking = await createBooking(user.id,room.id)
        const response = await server.put(`/booking/${booking.id}`).send({roomId:"batata"}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403)
    })

    it("should respond with 404 when there is no room for the passed roomId",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)
        const booking = await createBooking(user.id,room.id)
        const response = await server.put(`/booking/${booking.id}`).send({roomId: faker.datatype.number()}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404)
    })

    it("should respond with 403 when there is no booking for the passed bookingId",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)
        const room2 = await createRoomForHotel(hotel.id)
        const response = await server.put(`/booking/${faker.datatype.number()}`).send({roomId:room2.id}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403)
    })

    it("should respond with 200 and the correct body when editing a booking",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)
        const room2 = await createRoomForHotel(hotel.id)
        const booking = await createBooking(user.id,room.id)
        const response = await server.put(`/booking/${booking.id}`).send({roomId:room2.id}).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200)
        expect(response.body).toEqual({bookingId: expect.any(Number)})
    })
})