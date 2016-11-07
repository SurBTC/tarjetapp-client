import { ActionReducer, Action } from '@ngrx/store';


export const appView: ActionReducer<string> = (state: string = 'SIMULATION_VIEW', action: Action) => {
	switch (action.type) {
		case 'SIMULATION_VIEW':
			return 'SIMULATION_VIEW';

		case 'CREATION_VIEW':
			return 'CREATION_VIEW';

		default:
			return state;
	}
}