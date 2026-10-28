
import { Injectable } from '@angular/core';

export interface DatosClima {
  temperatura: number;
  precipitacion: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  async consultarClima(
    latitud: number,
    longitud: number
  ): Promise<DatosClima> {

    const direccion =
      `${this.apiUrl}?latitude=${latitud}` +
      `&longitude=${longitud}` +
      '&current=temperature_2m,weather_code' +
      '&hourly=precipitation' +
      '&past_days=1' +
      '&forecast_days=1' +
      '&timezone=America%2FGuayaquil';

    const respuesta = await fetch(direccion);

    if (!respuesta.ok) {
      throw new Error('No se pudo consultar el clima.');
    }

    const datos = await respuesta.json();

    if (
      !datos.current ||
      !datos.hourly ||
      !Array.isArray(datos.hourly.time) ||
      !Array.isArray(datos.hourly.precipitation)
    ) {
      throw new Error(
        'La API no devolvió datos meteorológicos completos.'
      );
    }

    const horaActual = Date.parse(datos.current.time);

    if (Number.isNaN(horaActual)) {
      throw new Error('No se pudo interpretar la hora actual del clima.');
    }

    const horas: string[] = datos.hourly.time;
    const precipitaciones: number[] = datos.hourly.precipitation;

    let indiceAnterior = -1;
    let horaAnterior = -Infinity;

    for (let i = 0; i < horas.length; i++) {
      const horaDisponible = Date.parse(horas[i]);

      if (Number.isNaN(horaDisponible)) {
        continue;
      }

      // elegir la hora más reciente que no sea posterior a la actual.
      if (
        horaDisponible <= horaActual &&
        horaDisponible > horaAnterior
      ) {
        horaAnterior = horaDisponible;
        indiceAnterior = i;
      }
    }

    // evitra utilizar datos de una hora demasiado antigua.
    if (
      indiceAnterior === -1 ||
      horaActual - horaAnterior > 90 * 60 * 1000
    ) {
      throw new Error(
        'No se encontraron datos de precipitación de la hora anterior.'
      );
    }

    const valorPrecipitacion = precipitaciones[indiceAnterior];

    if (
      typeof valorPrecipitacion !== 'number' ||
      !Number.isFinite(valorPrecipitacion)
    ) {
      throw new Error('La API no devolvió una precipitación válida.');
    }

    const codigo = datos.current.weather_code;

    let descripcion = 'Condición meteorológica no identificada';

    if (codigo === 0) {
      descripcion = 'Despejado';
    } else if (codigo === 1 || codigo === 2) {
      descripcion = 'Parcialmente nublado';
    } else if (codigo === 3) {
      descripcion = 'Nublado';
    } else if (codigo === 45 || codigo === 48) {
      descripcion = 'Niebla';
    } else if (
      (codigo >= 51 && codigo <= 67) ||
      (codigo >= 80 && codigo <= 82)
    ) {
      descripcion = 'Lluvia o llovizna';
    } else if (codigo >= 71 && codigo <= 77) {
      descripcion = 'Nevada';
    } else if (codigo >= 95) {
      descripcion = 'Tormenta';
    }

    return {
      temperatura: datos.current.temperature_2m,
      precipitacion: Number(valorPrecipitacion.toFixed(2)),
      descripcion
    };
  }
}
