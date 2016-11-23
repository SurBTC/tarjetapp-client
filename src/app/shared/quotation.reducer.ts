import { Quotation } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const initialQuotation:Quotation = {
	uuid: 'c6140853-9d5e-4f13-86cd-9040d89b35bf',
	sourceAmount: 7831,
	sourceCurrency: 'CLP',
	destinationAmount: 10,
	destinationCurrency: 'USD',
	creationFeeAmount: 1000,
	creationFeeCurrency: 'CLP',
	expiresAt: new Date(),
	updatedAt: new Date()
}

export const quotation: ActionReducer<Quotation> = (state:Quotation=initialQuotation, action:Action) => {
	switch (action.type) {

		case 'UPDATE_QUOTATION':
			console.log(action.payload);
			return action.payload;

		default:
			return state;
	}
}