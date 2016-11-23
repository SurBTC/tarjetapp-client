import { User } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const defaultUser:User = {
	uuid: '92a9f6b4-67aa-473f-bf26-e1ead9cf98ca',
	firstName: 'Camilo',
	lastName: 'Flores',
	email: 'camilo@dinex.cl',
	RUT: '157356399',
	birthDate: new Date((new Date()).setFullYear(1990)),
	address: 'Aqui 23423',
	city: 'Temuco',
	zipCode: '23423423',
	phone: '234234234'
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
