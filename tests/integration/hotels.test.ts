import app, { init } from "@/app"
import supertest from "supertest"
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, createTicket, createTicketTypeRemoteBollean, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoomForHotel } from "../factories/hotels-factory";

const server = supertest(app)

beforeAll(async () => {
    await init();
    await cleanDb()
})

beforeEach(async () => {
    await cleanDb()
})

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(401);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });

    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
        const token = await generateValidToken();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(404);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(404);
    });

    it('should respond with status 402 when user ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(402);
    });


    it('should respond with status 402 when user ticketStatus is RESERVED', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(402);
    });

    it('should respond with status 404 when there are no hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(404)
    });

    it('should respond with status 200 and the hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString()
            }
        ])
    });
})

describe('GET /hotels/:hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/1');

        expect(response.status).toBe(401);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/2').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/3').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });

    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
        const token = await generateValidToken();

        const response = await server.get('/hotels/4').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(404);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels/5').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(404);
    });

    it('should respond with status 402 when user ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/6').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(402);
    });


    it('should respond with status 402 when user ticketStatus is RESERVED', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels/7').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(402);
    });
    it('should respond with status 404 when there are no hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get(`/hotels/8`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(404);
    });

    it('should respond with status 200 and the hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemoteBollean(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel()
        const room = await createRoomForHotel(hotel.id)

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: [
                    {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        hotelId: room.hotelId,
                        createdAt: room.createdAt.toISOString(),
                        updatedAt: room.updatedAt.toISOString()
                    }
                ]
            }
        )
    });
})