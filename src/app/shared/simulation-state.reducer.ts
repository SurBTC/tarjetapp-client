import { ActionReducer, Action } from '@ngrx/store';

export interface SimulationState {
	error: boolean,
	loading: boolean
}

const defaultSimulationState = {
	error: false,
	loading: false
}

export const simulationState: ActionReducer<SimulationState> = (state: SimulationState = defaultSimulationState, action: Action) => {
	switch (action.type) {

		case 'SIMULATION_LISTENING':
			return { error: false, loading: false };

		case 'SIMULATION_LOADING':
			return { error: false, loading: true };

		case 'SIMULATION_LOADED':
			return { error: false, loading: false };

		case 'SIMULATION_ERROR':
			return { error: true, loading: false };

		default:
			return state;
	}
}