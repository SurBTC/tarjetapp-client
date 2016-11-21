import { User } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const defaultUser:User = {
	uuid: '60b94234-faf4-49bd-bf3a-7cbeb0aa1785',
	firstName: 'Camilo',
	lastName: 'Flores',
	email: 'yo@aqui.com',
	RUT: '157356399',
	birthDate: new Date(),
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
