import { User } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const defaultUser:User = {
	uuid: '',
	firstName: '',
	lastName: '',
	email: '',
	RUT: '',
	birthDate: new Date(),
	address: '',
	city: '',
	zipCode: '',
	phone: ''
}

export const user: ActionReducer<User> = (state:User=defaultUser, action:Action) => {
	switch (action.type) {

		case 'UPDATE_USER':
			let newState = Object.assign(state, action.payload);
			console.log(newState);
			return newState

		default:
			return state;
	}
}
