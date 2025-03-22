export interface Clima {
  datetime: Date;
  tempmax: number;
  tempmin: number;
  temp: number;
  humidity: number;
  windspeed: number;
  visibility: number;
  solarradiation: number;
  description: string;
  day?: string; // Nueva propiedad para el día de la semana
  progressValue?: number; // Nueva propiedad para el progreso de la barra
}
