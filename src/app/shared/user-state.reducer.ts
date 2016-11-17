import { ActionReducer, Action } from '@ngrx/store';
import { ServiceState, defaultUserState } from './models';


export const UserState: ActionReducer<UserState> = (state: UserState = defaultUserState, action: Action) => {
	switch (action.type) {

		case 'USER_CREATING':
			return Object.assign(state, { error: false, loading: true })

		case 'USER_CREATED':
			return Object.assign(state, { error: false, loading: false })

		case 'USER_ERROR':
			return Object.assign(state, { error: true, loading: false })

		case 'USER_VALID':
			return Object.assign(state, { valid: true })

		case 'USER_INVALID':
			return Object.assign(state, { valid: false })

		default:
			return state;
	}
}