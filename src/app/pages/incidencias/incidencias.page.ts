
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonImg
} from '@ionic/angular';

import {
  IncidenciasService,
  Incidencia
} from '../../services/incidencias.service';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.page.html',
  styleUrls: ['./incidencias.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonImg,
    RouterLink
  ]
})
export class IncidenciasPage implements OnInit {

  incidencias: Incidencia[] = [];

  pagina = 1;
  limite = 5;
  hayMasIncidencias = true;
  cargando = false;
  mensajeError = '';

  // Identificadores de incidencias guardadas para seguimiento.
  private claveSeguimiento = 'urbaninspect_seguimiento';
  incidenciasSeguidas: string[] = [];

  // Permite mostrar todas o solamente las seguidas.
  mostrarSoloSeguidas = false;

  constructor(
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarSeguimientoLocal();
    this.cargarIncidencias();
  }

  cargarSeguimientoLocal() {
    try {
      const datos = localStorage.getItem(this.claveSeguimiento);

      if (datos) {
        const identificadores: unknown = JSON.parse(datos);

        if (
          Array.isArray(identificadores) &&
          identificadores.every(id => typeof id === 'string')
        ) {
          this.incidenciasSeguidas = identificadores;
        }
      }
    } catch (error) {
      console.error('No se pudo recuperar el seguimiento local:', error);
      this.incidenciasSeguidas = [];
    }
  }

  estaEnSeguimiento(incidencia: Incidencia): boolean {
    return incidencia.id !== undefined &&
      this.incidenciasSeguidas.includes(String(incidencia.id));
  }

  alternarSeguimiento(incidencia: Incidencia) {
    if (incidencia.id === undefined) {
      return;
    }

    const id = String(incidencia.id);

    if (this.incidenciasSeguidas.includes(id)) {
      this.incidenciasSeguidas =
        this.incidenciasSeguidas.filter(idGuardado => idGuardado !== id);
    } else {
      this.incidenciasSeguidas = [
        ...this.incidenciasSeguidas,
        id
      ];
    }

    try {
      localStorage.setItem(
        this.claveSeguimiento,
        JSON.stringify(this.incidenciasSeguidas)
      );
    } catch (error) {
      this.mensajeError =
        'No se pudo guardar el seguimiento en este dispositivo.';
      console.error('Error al guardar el seguimiento:', error);
    }
  }

  get incidenciasVisibles(): Incidencia[] {
    if (!this.mostrarSoloSeguidas) {
      return this.incidencias;
    }

    return this.incidencias.filter(
      incidencia => this.estaEnSeguimiento(incidencia)
    );
  }

  async cambiarFiltroSeguimiento() {
    this.mostrarSoloSeguidas = !this.mostrarSoloSeguidas;

    // Al consultar las seguidas, buscamos todas las páginas
    // en el servidor para encontrar también las que aún no se cargaron.
    if (this.mostrarSoloSeguidas) {
      this.cargando = true;
      this.mensajeError = '';

      try {
        const todasLasIncidencias: Incidencia[] = [];
        let paginaActual = 1;
        let lote: Incidencia[];

        do {
          lote =
            await this.incidenciasService.obtenerIncidenciasPorPagina(
              paginaActual,
              this.limite
            );

          todasLasIncidencias.push(...lote);
          paginaActual++;
        } while (lote.length === this.limite);

        this.incidencias = todasLasIncidencias;
        this.pagina = paginaActual;
        this.hayMasIncidencias = false;

      } catch (error) {
        this.mostrarSoloSeguidas = false;
        this.mensajeError =
          'No se pudieron consultar las incidencias seguidas.';
        console.error('Error al consultar las incidencias:', error);

      } finally {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    }
  }

  async cargarIncidencias() {
    if (this.cargando || !this.hayMasIncidencias) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    try {
      const nuevasIncidencias =
        await this.incidenciasService.obtenerIncidenciasPorPagina(
          this.pagina,
          this.limite
        );

      this.incidencias = [
        ...this.incidencias,
        ...nuevasIncidencias
      ];

      if (nuevasIncidencias.length < this.limite) {
        this.hayMasIncidencias = false;
      } else {
        this.pagina++;
      }

      if (
        nuevasIncidencias.length === 0 &&
        this.incidencias.length === 0
      ) {
        this.mensajeError = 'No hay incidencias registradas.';
      }

    } catch (error) {
      this.mensajeError =
        'No se pudieron cargar las incidencias. Revisa tu conexión.';
      console.error('Error al consultar MockAPI:', error);

    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
