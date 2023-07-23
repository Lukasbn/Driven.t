import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createBooking(userId:number, roomId:number){
    return prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
    
}

export function getFullRoom(){
    return {
        name: faker.name.findName(),
        capacity: 3,
        hotelId: faker.datatype.number(),
        _count:{
            Booking: 3
        }
    }
}

export function getBookingFactory(){
    return {
        id:faker.datatype.number(),
        Room:{
            name: faker.name.findName(),
            capacity: faker.datatype.number(),
            hotelId: faker.datatype.number()
        }
    }
}
