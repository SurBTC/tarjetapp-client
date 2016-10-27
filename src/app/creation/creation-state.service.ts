import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CreationStateService {

	private statusSource = new BehaviorSubject<string>('deposit')

	public statusUpdates = this.statusSource.asObservable();

	updateState(state:string) {
		this.statusSource.next(state);
	}

	getState() {
		return this.statusSource.getValue();
	}

  constructor() { }

}
