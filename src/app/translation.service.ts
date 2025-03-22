import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=';

  constructor(private http: HttpClient) {}

  translate(text: string) {
    return this.http.get<any>(`${this.apiUrl}${encodeURIComponent(text)}`);
  }
}
