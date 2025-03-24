import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: string[] = [];
  private starFavorite: boolean = false;
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
    //console.log("Antes de eliminar:", this.favorites);

    this.favorites = this.favorites.filter(favCity => favCity.trim().toLowerCase() !== city.trim().toLowerCase());

    //console.log("Después de eliminar:", this.favorites);
  }

  isFavorite(city: string): boolean {
    if (!this.favorites || this.favorites.length === 0) return false;
    return this.favorites.some(favCity => favCity.trim().toLowerCase() === city.trim().toLowerCase());
  }



  constructor() {}
}
