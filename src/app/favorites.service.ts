import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: string[] = [];

    //BehaviorSubject almacena ultimo valor
  private favoritesSubject = new BehaviorSubject<string[]>(this.favorites);


  //asObservable solo puedan leer el valor, pero no modificarlo.
  favorites$ = this.favoritesSubject.asObservable();

  getFavorites(): string[] {
    return this.favorites;
  }

    //investigar esto
  addCity(city: string) {
    const normalizedCity = city.toLowerCase();
    const exists = this.favorites.some(c => c.toLowerCase() === normalizedCity);

    if (!exists) {
      this.favorites.push(city.toUpperCase());

      //next([...this.favorites]) crea una copia nueva del array para que Angular detecte el cambio.
      this.favoritesSubject.next([...this.favorites]);
    }
  }

  removeCity(city: string) {
    this.favorites = this.favorites.filter(c => c !== city);

    //emite nuevo estado a todos los subscriptores
    this.favoritesSubject.next([...this.favorites]);
  }

  isFavorite(city: string): boolean {
    return this.favorites.includes(city);
  }

  constructor() {}
}
