import { ActionReducer, Action } from '@ngrx/store';

const initialTask = 'GET_DATA';

export const creationTask: ActionReducer<string> = (state: string = initialTask, action: Action) => {
  switch (action.type) {
    case 'UPDATE_CREATION_TASK':
      return action.payload;

    default:
      return state;
  }
};
