import { Quotation } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const initialQuotation: Quotation = {
  uuid: null,
  sourceAmount: null,
  sourceCurrency: null,
  destinationAmount: null,
  destinationCurrency: null,
  creationFeeAmount: null,
  creationFeeCurrency: null,
  expiresAt: new Date(),
  updatedAt: new Date()
};

export const quotation: ActionReducer<Quotation> = (state: Quotation = initialQuotation, action: Action) => {
  switch (action.type) {

    case 'UPDATE_QUOTATION':
      return action.payload;

    default:
      return state;
  }
};
