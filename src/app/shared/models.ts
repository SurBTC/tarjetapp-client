export interface User {
	firstName?: string,
	lastName?: string,
	email?: string,
	ruts?: string
	birthDate?: Date,
	address?: string,
	city?: string,
	zipCode?: string,
	phone?: string,
}

export interface Quotation {
	id?: string,
	sourceAmount: number,
	sourceCurrency?: string,
	destinationAmount: number,
	destinationCurrency?: string,
	expiresAt?: Date
}