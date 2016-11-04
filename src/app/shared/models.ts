
export interface Simulation {
	sourceAmount: number,
	sourceCurrency?: string,
	destinationAmount: number,
	destinationCurrency?: string,
	updatedAt: Date,
	expiresAt: Date
}

export interface Quotation {
	uuid: string,
	sourceAmount: number,
	sourceCurrency?: string,
	destinationAmount: number,
	destinationCurrency?: string,
	updatedAt: Date,
	expiresAt: Date
}

export interface CreationFee {
	amount: number,
	currency?: string
}

export interface User {
	uuid?: string,
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

export interface ApiResponse {
	quotation: Quotation,
	fee: {
		amount:number,
		description?: string
	}
}