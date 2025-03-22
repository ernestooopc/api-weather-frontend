import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Clima } from './models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private lat: number | null = null;
  private lon: number | null = null;

  private apiUrl = 'http://localhost:8080/api/clima/';

  constructor(private http:HttpClient) { }

  getClimate(ciudad:string):Observable<Clima>{
    return this.http.get<any>(`${this.apiUrl}${ciudad}`);
  }

  getClimateAll(ciudad: string): Observable<Clima[]> {
    return this.http.get<any>(`${this.apiUrl}${ciudad}/all`);
  }

  getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (this.lat !== null && this.lon !== null) {
        resolve({ lat: this.lat, lon: this.lon }); // Devuelve las coordenadas guardadas
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            resolve({ lat: this.lat, lon: this.lon });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocalización no soportada'));
      }
    });
  }

  getWeatherByCoords(lat: number, lon: number): Observable<Clima> {
    return this.http.get<Clima>(`${this.apiUrl}coords?lat=${lat}&lon=${lon}`);
  }

  getCityName(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const address = response.address;
        return (
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          address.state ||
          address.region ||
          address.country ||
          'Ubicación desconocida'
        );
      }),
      catchError(error => {
        return of('Ubicación desconocida');
      })
    );
  }






}
