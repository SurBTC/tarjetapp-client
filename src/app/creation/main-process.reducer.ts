import { ActionReducer, Action } from '@ngrx/store';

const mainProcessTasks = [
	// 'GET_DATA',
	'GET_DEPOSIT',
	'GET_CARD',
]


export const MainProcessReducer: ActionReducer<string> = (state: string = mainProcessTasks[0], action: Action) => {
	let currentStateIdx = mainProcessTasks.findIndex(possibleState => possibleState === state);
	if (currentStateIdx === undefined) {
		console.error(`State ${state} is not known`);
		return state;
	}

	switch (action.type) {
		case 'NEXT_PROCESS_TASK':
			if (currentStateIdx === mainProcessTasks.length) {
				console.log(`There is no state after ${state}`);
				return state;
			}
			else {
				return mainProcessTasks[currentStateIdx + 1];
			}

		case 'PREVIOUS_PROCESS_TASK':
			if (currentStateIdx === 0) {
				console.log(`There is no state before ${state}`);
				return state;
			}
			else {
				return mainProcessTasks[currentStateIdx - 1];
			}

		case 'RESET_PROCESS':
			return mainProcessTasks[0];

		default:
			return state;
	}
}
