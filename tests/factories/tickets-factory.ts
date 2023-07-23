import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function getTicketWithHotelBoolean(enrollmentId: number, hotel: boolean, status: TicketStatus){
  return {
    enrollmentId,
    TicketType: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: !hotel,
      includesHotel: hotel,
    },
    status,
  }
}

export async function createTicketTypeRemoteBollean(alt:boolean){
  return prisma.ticketType.create({
    data:{
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: alt,
      includesHotel: !alt
    }
  })
}
