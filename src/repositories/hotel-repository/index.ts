import { prisma } from "@/config";

async function getHotelsDB(){
    return prisma.hotel.findMany()
}

const hotelRepository  = { getHotelsDB }

export default hotelRepository