import { ActionReducer, Action } from '@ngrx/store';
import { ServiceState, defaultServiceState } from './models';


export const simulationState: ActionReducer<ServiceState> = (state: ServiceState = defaultServiceState, action: Action) => {
	switch (action.type) {

		// case 'SIMULATION_LISTENING':
		// 	return Object.assign(state, { error: false, loading: false })

		case 'SIMULATION_LOADING':
			return Object.assign(state, { error: false, loading: true })

		case 'SIMULATION_LOADED':
			return Object.assign(state, { error: false, loading: false })

		case 'SIMULATION_ERROR':
			return Object.assign(state, { error: true, loading: false })

		case 'SIMULATION_VALID':
			return Object.assign(state, { valid: true })

		case 'SIMULATION_INVALID':
			return Object.assign(state, { valid: false })

		default:
			return state;
	}
}