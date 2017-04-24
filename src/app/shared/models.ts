
export interface Simulation {
  sourceAmount: number;
  sourceCurrency?: string;
  destinationAmount: number;
  destinationCurrency?: string;
  creationFeeAmount?: number;
  creationFeeCurrency?: string;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Quotation {
  uuid?: string;
  sourceAmount: number;
  sourceCurrency?: string;
  destinationAmount: number;
  destinationCurrency?: string;
  creationFeeAmount: number;
  creationFeeCurrency?: string;
  updatedAt: Date;
  expiresAt: Date;
}

export interface User {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  RUT?: string;
  birthDate?: Date;
  address?: string;
  locality?: string;
  zipCode?: string;
  phone?: string;
}

export interface Card {
  uuid: string;
  status: string;
  currency: string;
  creationDate: string;
  expiryDate: string;
  pan: string;
  programName: string;
  nameOnCard: string;
}

export interface ServiceState {
  error: boolean;
  loading: boolean;
  valid: boolean;
  exceedsMax: boolean;
}
