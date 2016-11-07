import { CreationFee } from './models';
import { ActionReducer, Action } from '@ngrx/store';

export const creationFee: ActionReducer<CreationFee> = (state:CreationFee, action:Action) => {
	switch (action.type) {
		case 'UPDATE_CREATION_FEE':
			return action.payload;

		default:
			return state;
	}
}