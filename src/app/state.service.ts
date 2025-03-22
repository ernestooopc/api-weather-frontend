// state.service.ts
import { Injectable } from '@angular/core';
import { Clima } from './models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private lastSearch: string = '';
  private currentClimate: Clima | null = null;
  private allClimate: Clima[] = [];
  private hasInitialized: boolean = false;

  constructor() { }

  setLastSearch(search: string) {
    this.lastSearch = search;
  }

  getLastSearch(): string {
    return this.lastSearch;
  }

  setCurrentClimate(climate: Clima | null) {
    this.currentClimate = climate;
  }

  getCurrentClimate(): Clima | null {
    return this.currentClimate;
  }

  setAllClimate(climates: Clima[]) {
    this.allClimate = climates;
  }

  getAllClimate(): Clima[] {
    return this.allClimate;
  }

  setInitialized(value: boolean) {
    this.hasInitialized = value;
  }

  hasBeenInitialized(): boolean {
    return this.hasInitialized;
  }
}
