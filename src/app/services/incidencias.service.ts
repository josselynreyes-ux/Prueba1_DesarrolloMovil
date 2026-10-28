
import { Injectable } from '@angular/core';

export interface Incidencia {
  id?: string;
  tipo: string;
  descripcion: string;
  direccion: string;
  sector: string;
  fecha: string;
  estado: string;
  prioridad: string;
  fotografia: string;
  latitud: number | null;
  longitud: number | null;
  observacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  private apiUrl =
    'https://6ae15825be3bc8fead9869dc.mockapi.io/incidencias';

  // Consultar todas las incidencias.
  async obtenerIncidencias(): Promise<Incidencia[]> {
    const respuesta = await fetch(this.apiUrl);

    if (!respuesta.ok) {
      throw new Error('No se pudieron consultar las incidencias');
    }

    const incidencias: Incidencia[] = await respuesta.json();
    return incidencias;
  }

  // Consultar incidencias por páginas.
  async obtenerIncidenciasPorPagina(
    pagina: number,
    limite: number
  ): Promise<Incidencia[]> {
    const direccion =
      `${this.apiUrl}?page=${pagina}&limit=${limite}`;

    const respuesta = await fetch(direccion);

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las incidencias');
    }

    const incidencias: Incidencia[] = await respuesta.json();
    return incidencias;
  }

  // Consultar una incidencia por su código.
  async obtenerIncidenciaPorId(
    id: string
  ): Promise<Incidencia> {
    const respuesta = await fetch(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo consultar la incidencia');
    }

    const incidencia: Incidencia = await respuesta.json();
    return incidencia;
  }

  // Registrar una incidencia nueva.
  async guardarIncidencia(
    incidencia: Incidencia
  ): Promise<Incidencia> {
    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(incidencia)
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo guardar la incidencia');
    }

    const incidenciaGuardada: Incidencia =
      await respuesta.json();

    return incidenciaGuardada;
  }

  // Actualizar una incidencia sin perder sus otros datos.
  async actualizarIncidencia(
    id: string,
    cambios: Partial<Incidencia>
  ): Promise<Incidencia> {

    // Primero consultamos el registro completo.
    const incidenciaActual =
      await this.obtenerIncidenciaPorId(id);

    // Combinamos los datos existentes con los cambios.
    const incidenciaCompleta: Incidencia = {
      ...incidenciaActual,
      ...cambios,
      id: incidenciaActual.id
    };

    // Enviamos el registro completo mediante PUT.
    const respuesta = await fetch(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incidenciaCompleta)
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();

      console.error(
        'Error de MockAPI:',
        respuesta.status,
        detalle
      );

      throw new Error(
        `Error ${respuesta.status}: ${
          detalle || 'No se pudo actualizar la incidencia'
        }`
      );
    }

    const incidenciaActualizada: Incidencia =
      await respuesta.json();

    return incidenciaActualizada;
  }
}
