
export interface Simulation {
	sourceAmount: number,
	sourceCurrency?: string,
	destinationAmount: number,
	destinationCurrency?: string,
	creationFeeAmount?: number,
	creationFeeCurrency?: string,
	updatedAt: Date,
	expiresAt: Date
}

export interface Quotation {
	uuid?: string,
	sourceAmount: number,
	sourceCurrency?: string,
	destinationAmount: number,
	destinationCurrency?: string,
	creationFeeAmount: number,
	creationFeeCurrency?: string,
	updatedAt: Date,
	expiresAt: Date
}

export interface User {
	uuid?: string,
	firstName?: string,
	lastName?: string,
	email?: string,
	RUT?: string
	birthDate?: Date,
	address?: string,
	city?: string,
	zipCode?: string,
	phone?: string,
}

export interface ApiResponse {
	quotation: Quotation,
	fee: {
		amount:number,
		description?: string
	}
}

export interface ServiceState {
	error: boolean,
	loading: boolean
	valid: boolean
}

export const defaultServiceState:ServiceState = {
	error: false,
	loading: false,
	valid: false
}