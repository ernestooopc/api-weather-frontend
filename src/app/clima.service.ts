import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clima } from './models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiUrl = 'http://localhost:8080/api/clima/';

  constructor(private http:HttpClient) { }

  getClimate(ciudad:string):Observable<Clima>{
    return this.http.get<any>(`${this.apiUrl}${ciudad}`);
  }

  getClimateAll(ciudad: string): Observable<Clima[]> {
    return this.http.get<any>(`${this.apiUrl}${ciudad}/all`);
  }



}
