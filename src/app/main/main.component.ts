import { Component, Input} from '@angular/core';
import { Clima } from '../models/clima.model';
import { ClimaService } from '../clima.service';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin, of, Subscription, take } from 'rxjs';
import { TranslationService } from '../translation.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { FavoritesService } from '../favorites.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-main',
  imports: [FormsModule,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MainComponent {
  isFavorite = false;
  weatherData: Clima | null = null;
  currentClimate:Clima | null = null;
  allClimate: Clima[] = [];

  @Input() city: string = '';

  lat: number | null = null;
  lon: number | null = null;
  cityName: string = 'Cargando...';
  tempCity: string = '';

  showAnimation = true;
  loadingSearchClimate = false;
  loadingSearchClimateAll = false;
  private favoritesSubscription: Subscription = new Subscription;

  constructor(private climaService: ClimaService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    private favoritesService: FavoritesService,
    private stateService: StateService,

  ) {}


  ngOnInit() {


    if (this.stateService.hasBeenInitialized()) {
      this.tempCity = this.stateService.getLastSearch();
      this.city = this.tempCity;
      this.currentClimate = this.stateService.getCurrentClimate();
      this.allClimate = this.stateService.getAllClimate();
    } else {
      this.climaService.getUserLocation().then(coords => {
        this.lat = coords.lat;
        this.lon = coords.lon;
        this.climaService.getCityName(this.lat, this.lon).subscribe(city => {
          this.cityName = city;
          this.getWeatherByCoords(this.lat!, this.lon!);
        });
        this.stateService.setInitialized(true);
      }).catch(error => {
        console.error('Error obteniendo coordenadas', error);
      });
      const saveFavorite = localStorage.getItem('isFavorite');
      this.isFavorite = saveFavorite === 'true';  // Convierte string a booleano
    }


    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(() => {
    this.checkFavorite();
    });

  }

  ngOnDestroy() {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }


  updateCity() {
    if (this.tempCity.trim()) {
      this.city = this.tempCity;
      if (this.weatherData) {
        this.searchClimate();
      } else {
        console.error("weatherData no está definida");
      }
    }
  }


  searchClimate() {
    this.loadingSearchClimate = true;
    this.city = this.tempCity.trim();
    if (this.city === '') {
      this.loadingSearchClimate = false;
      return;
    }
    // Guardar la búsqueda actual
    this.stateService.setLastSearch(this.city);
    this.climaService.getClimate(this.city).subscribe({
      next: (clima: Clima) => {
        this.translationService.translate(clima.description).subscribe(response => {
          const translatedText = response[0][0][0];
          this.currentClimate = {
            ...clima,
            temp: Math.round(clima.temp),
            tempmin: Math.round(clima.tempmin),
            tempmax: Math.round(clima.tempmax),
            windspeed: Math.round(clima.windspeed),
            description: translatedText,
            datetime: clima.datetime
          };
          // Guardar el clima actual en el servicio
          this.stateService.setCurrentClimate(this.currentClimate);
        });
      },
      error: (error) => {
        console.log('Error al obtener el clima', error);
      },
      complete: () => {
        console.log("Búsqueda del clima completada");
        this.loadingSearchClimate = false;
      }
    });
  }

  searchClimateAll() {
    this.loadingSearchClimateAll = true;
    this.city = this.tempCity.trim();
    if (this.city === '') {
      this.loadingSearchClimateAll = false;
      return;
    }
    this.stateService.setLastSearch(this.city);
    this.climaService.getClimateAll(this.city).pipe(take(1)).subscribe({
      next: (climaArray: Clima[]) => {
        if (!climaArray || climaArray.length === 0) return;
        const traducciones$ = climaArray.map(c =>
          this.translationService.translate(c.description).pipe(
            map((response: any) => {
              console.log(`Temp original: ${c.temp}`);
              const temp = c.temp !== null && c.temp !== undefined ? parseFloat(c.temp.toFixed(1)) : 0;
              const tempmin = Math.round(c.tempmin);
              const tempmax = Math.round(c.tempmax);
              const progressValue = ((temp - tempmin) / (tempmax - tempmin)) * 100;
              return {
                ...c,
                temp,
                description: response[0][0][0],
                day: new Date(c.datetime).toLocaleDateString('es-ES', { weekday: 'long' }),
                icon: this.getWeatherIcon(c.description),
                tempmax,
                tempmin,
                progressValue
              };

            })

          )
        );
        forkJoin(traducciones$).subscribe((translatedClimates: Clima[]) => {
          this.allClimate = translatedClimates;
          this.stateService.setAllClimate(this.allClimate);
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.log("Error al obtener todos los climas", error);
      },
      complete: () => {
        console.log("Búsqueda completada");
        this.loadingSearchClimateAll = false;
      }
    });
  }

  getWeatherByCoords(lat: number, lon: number): void {
    this.climaService.getCityName(lat, lon).pipe(
      switchMap(cityName => {
        this.city = cityName;
        this.tempCity = cityName;
        return this.climaService.getWeatherByCoords(lat, lon);
      })
      ,
      switchMap((clima: Clima) =>
        this.translationService.translate(clima.description).pipe(
          catchError(error => {
            console.error('❌ Error al traducir', error);
            return of([[[clima.description]]]);
          }),
          map(response => {
            const translatedText = response[0][0][0];
            return {
              ...clima,
              temp: Math.round(clima.temp),
              tempmin: Math.round(clima.tempmin),
              tempmax: Math.round(clima.tempmax),
              windspeed: Math.round(clima.windspeed),
              description: translatedText,
              datetime: clima.datetime
            };
          })
        )
      )
    ).subscribe({
      next: (updatedClima) => {
        this.currentClimate = updatedClima;
      },
      error: (error) => console.error('❌ Error al obtener el clima:', error)
    });
  }


  getWeatherIcon(description: string): string {
    console.log("Descripción recibida:", description); // Para depuración
    let icon = 'default.png';
    if (description.includes('Parcialmente nublado durante todo el día.')) {
      icon = 'cloudy.png';
    } else if (description.includes('Lluvia')) {
      icon = 'rain.png';
    } else if (description.includes('soleado')) {
      icon = 'sunny.png';
    } else if (description.includes('Parcialmente nublada.')) {
      icon = 'partly-cloudy.png';
    }
    const iconPath = `${icon}`;
    console.log("Ruta del icono generada:", iconPath); // Para depuración
    return iconPath;
  }

  animateTemperature(targetTemp: number) {
    let currentTemp = 0;
    const interval = setInterval(() => {
      if (currentTemp < targetTemp) {
        currentTemp++;
      } else {
        clearInterval(interval);
      }
      this.currentClimate!.temp = currentTemp;
      this.cdr.detectChanges();
    }, 50);
  }

  checkFavorite() {
    this.isFavorite = this.favoritesService.getFavorites().includes(this.city);
  }



  toggleFavorite() {
    if (!this.isFavorite) {
      this.isFavorite = true;
      this.favoritesService.addCity(this.city);
      localStorage.setItem('isFavorite', 'true');
      alert("Se agregó a favoritos.");
    } else {
      this.favoritesService.removeCity(this.city);
      this.isFavorite = false;
      localStorage.setItem('isFavorite', 'false');
      alert("Se eliminó de favoritos.");
    }
    if (this.currentClimate) {
      this.stateService.setCurrentClimate(this.currentClimate);
    }
    if (this.allClimate && this.allClimate.length > 0) {
      this.stateService.setAllClimate(this.allClimate);
    }
    this.stateService.setLastSearch(this.city);
    this.stateService.setInitialized(true);
  }




}
