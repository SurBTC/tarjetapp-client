import { ActionReducer, Action } from '@ngrx/store';
import { ServiceState } from './models';

const defaultServiceState = {
  error: false,
  loading: false,
  valid: false,
  exceedsMax: false
};

export const simulationState: ActionReducer<ServiceState> = (state: ServiceState = defaultServiceState, action: Action) => {
  switch (action.type) {

    case 'SIMULATION_LOADING':
      return Object.assign(state, { error: false, loading: true, exceedsMax: false });

    case 'SIMULATION_LOADED':
      return Object.assign(state, { error: false, loading: false });

    case 'SIMULATION_ERROR':
      return Object.assign(state, { error: true, loading: false });

    case 'SIMULATION_VALID':
      return Object.assign(state, { valid: true });

    case 'SIMULATION_INVALID':
      return Object.assign(state, { valid: false });

    case 'SIMULATION_EXCEEDS_MAX':
    return Object.assign(state, { exceedsMax: true, loading: false, valid: false });

    case 'SIMULATION_BELOW_MAX':
    return Object.assign(state, { exceedsMax: false, loading: false });

    default:
      return state;
  }
};
