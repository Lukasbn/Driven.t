import { prisma } from "@/config";

async function getHotelsDB(){
    return prisma.hotel.findMany()
}

async function getHotelByIdDB(id:number){
    return prisma.hotel.findFirst({
        where:{
            id
        },
        include:{
            Rooms: true
        }
    })
}

const hotelRepository  = { getHotelsDB, getHotelByIdDB }

export default hotelRepository