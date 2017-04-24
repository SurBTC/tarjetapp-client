import { Card } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const initialCard: Card = {
  uuid: '',
  status: 'NOT_CREATED',
  currency: 'USD',
  creationDate: '',
  expiryDate: '',
  pan: '',
  programName: '',
 nameOnCard: ''
};

export const card: ActionReducer<Card> = (state: Card = initialCard, action: Action) => {
  switch (action.type) {

    case 'UPDATE_CARD':
      return action.payload;

    case 'PATCH_CARD':
      return Object.assign(state, action.payload);

    default:
      return state;
  }
};
