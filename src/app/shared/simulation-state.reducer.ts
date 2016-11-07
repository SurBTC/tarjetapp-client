import { ActionReducer, Action } from '@ngrx/store';

export interface SimulationState {
	error: boolean,
	loading: boolean
}

const defaultSimulationState = {
	error: false,
	loading: false,
	valid: false
}

export const simulationState: ActionReducer<SimulationState> = (state: SimulationState = defaultSimulationState, action: Action) => {
	switch (action.type) {

		case 'SIMULATION_LISTENING':
			return Object.assign(state, { error: false, loading: false })

		case 'SIMULATION_LOADING':
			return Object.assign(state, { error: false, loading: true })

		case 'SIMULATION_LOADED':
			return Object.assign(state, { error: false, loading: false })

		case 'SIMULATION_ERROR':
			return Object.assign(state, { error: true, loading: false })

		case 'SIMULATION_VALID':
			return Object.assign(state, { valid: true})

		case 'SIMULATION_INVALID':
			return Object.assign(state, { valid: false })

		default:
			return state;
	}
}