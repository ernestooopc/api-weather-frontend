// src/app/utils/weather-translator.ts
export function translateWeatherDescription(description: string): string {
  if (!description) return "Descripción no disponible";

  const translations: { [key: string]: string } = {
    "clear sky": "Cielo despejado",
    "few clouds": "Pocas nubes",
    "scattered clouds": "Nubes dispersas",
    "broken clouds": "Nublado",
    "overcast clouds": "Cielo cubierto",
    "shower rain": "Llovizna",
    "rain": "Lluvia",
    "light rain": "Lluvia ligera",
    "moderate rain": "Lluvia moderada",
    "heavy rain": "Lluvia fuerte",
    "thunderstorm": "Tormenta",
    "snow": "Nieve",
    "light snow": "Nieve ligera",
    "heavy snow": "Nieve intensa",
    "mist": "Niebla",
    "fog": "Neblina",
    "haze": "Bruma",
    "drizzle": "Llovizna",
    "thunderstorm with rain": "Tormenta con lluvia",
    "thunderstorm with drizzle": "Tormenta con llovizna",
    "freezing rain": "Lluvia helada",
    "partly cloudy": "Parcialmente nublado",
    "partly cloudy throughout the day": "Parcialmente nublado durante todo el día",
    "cloudy skies throughout the day":"Cielos nublados durante todo el día",
    "becoming cloudy in the afternoon":"nublada por la tarde."

  };

  const lowerDesc = description.toLowerCase();

  // Buscar coincidencias parciales en frases largas
  for (const key in translations) {
    if (lowerDesc.includes(key)) {
      return translations[key];
    }
  }

  return description; // Si no hay traducción, devolver el original
}
