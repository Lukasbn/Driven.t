import faker, { Faker } from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel(){
    return prisma.hotel.create({
        data:{
            name: faker.name.findName(),
            image: faker.image.imageUrl()
        }
    })
}

export async function createRoomForHotel(hotelId:number){
    return prisma.room.create({
        data:{
            name: faker.name.findName(),
            capacity: faker.datatype.number(),
            hotelId
        }
    })
}