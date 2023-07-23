import { prisma } from '@/config';

async function getBookingByUserIdDB(userId: number){
    const result = await prisma.booking.findFirst({
        select:{
          id:true,
          Room:true  
        },
        where:{
            userId
        }
    })
    return result
}

async function getRoomById(id:number){
    const result = await prisma.room.findUnique({
        where:{
            id
        },
        include:{
            _count:{
                select:{
                    Booking:true
                }
            }
        }
    })
    return result
}

async function postBookingDB(userId:number, roomId: number){
    const result = await prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
    return result
}

async function putBookingDB(roomId:number, bookingId:number){
    const result = await prisma.booking.update({
        data:{
            roomId,
            updatedAt: new Date(Date.now())
        },
        where:{
            id: bookingId
        }
    })
    return result
}

const bookingRepository = {
    getBookingByUserIdDB,
    getRoomById,
    postBookingDB,
    putBookingDB
}

export default bookingRepository