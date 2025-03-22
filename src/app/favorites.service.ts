import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private favorites: string[] = [];

  getFavorites(): string[] {
    return this.favorites;
  }

  addCity(city: string) {
    const normalizedCity = city.toLowerCase();

    const exists = this.favorites.some(c => c.toLowerCase() === normalizedCity);

    if (!exists) {
      this.favorites.push(city.toUpperCase());
    }
  }


  removeCity(city: string) {
    this.favorites = this.favorites.filter(c => c !== city);
  }

  constructor() { }
}
