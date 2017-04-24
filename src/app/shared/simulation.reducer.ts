import { Simulation } from './models';
import { ActionReducer, Action } from '@ngrx/store';

const defaultSimulation: Simulation = {
  sourceAmount: null,
  sourceCurrency: 'CLP',
  destinationAmount: 10,
  destinationCurrency: 'USD',
  expiresAt: new Date(),
  updatedAt: new Date()
};

export const simulation: ActionReducer<Simulation> = (state: Simulation = defaultSimulation, action: Action) => {
  switch (action.type) {

    case 'UPDATE_SIMULATION':
      return action.payload;

    default:
      return state;
  }
};
