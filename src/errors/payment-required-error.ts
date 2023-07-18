import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: 'You have to pay the ticket to access this!',
  };
}