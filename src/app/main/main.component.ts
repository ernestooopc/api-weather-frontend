import { Component} from '@angular/core';
import { Clima } from '../models/clima.model';
import { ClimaService } from '../clima.service';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { translateWeatherDescription } from '../utils/weather-translator';

@Component({
  selector: 'app-main',
  imports: [FormsModule,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent {

  city:string = '';
  currentClimate:Clima | null = null;
  allClimate: Clima[] = [];

  constructor(private climaService: ClimaService) {}

  searchClimate() {
    if (this.city.trim() === '') return;

    this.climaService.getClimate(this.city).subscribe({
      next: (clima: Clima) => {
        this.currentClimate = {
          ...clima,
          temp: Math.round(clima.temp), // Redondear temperatura
          tempmin: Math.round(clima.tempmin),
          tempmax: Math.round(clima.tempmax),
          windspeed: Math.round(clima.windspeed),
          description: translateWeatherDescription(clima.description), // Traducir descripción
          datetime: new Date(clima.datetime) // Convertir fecha correctamente
        };
      },
      error: (error) => {
        console.log('Error al obtener el clima', error);
      },
      complete: () => {
        console.log("Búsqueda del clima completada");
      }
    });
  }



    searchClimateAll() {
      if (this.city.trim() === '') return;
      this.climaService.getClimateAll(this.city).pipe(take(1)).subscribe({
        next: (climaArray: Clima[]) => {
          if (!climaArray || climaArray.length === 0) return;
          const clima = climaArray[0];
          this.allClimate = climaArray.map(c => ({
            ...c,
            temp: Math.round(c.temp),
            description: translateWeatherDescription(c.description),
            day: new Date(c.datetime).toLocaleDateString('es-ES', { weekday: 'long' }),
            icon: this.getWeatherIcon(translateWeatherDescription(c.description))

          }));
        },
        error: (error) => {
          console.log("Error al obtener todos los climas", error);
        },
        complete: () => {
          console.log("Búsqueda completada");
        }
      });
    }



  formatDate(dateString: string): string {
    const fecha = new Date(dateString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }


  getWeatherIcon(description: string): string {
    console.log("Descripción recibida:", description); // Para depuración

    if (description.includes('Cielos nublados durante todo el día')) {
      return 'cloudy.png';
    } else if (description.includes('Lluvia')) {
      return 'rain.png';
    } else if (description.includes('soleado')) {
      return 'sunny.png';
    } else if(description.includes('Parcialmente nublado')){
      return 'partly-cloudy.png';
    }else{
      return 'default.png'
    }
  }







}
