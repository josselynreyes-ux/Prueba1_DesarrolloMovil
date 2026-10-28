
import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';

import { IncidenciasService, Incidencia } from '../../services/incidencias.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
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
    RouterLink,
    IonIcon
  ]
})
export class InicioPage {

  totalIncidencias = 0;
  pendientes = 0;
  enProceso = 0;
  mensajeError = '';
  cargando = false;

  constructor(
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta cada vez que se entra en la pantalla.
  ionViewWillEnter() {
    this.cargarIncidencias();
  }

  async cargarIncidencias() {
    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    try {
      const incidencias: Incidencia[] =
        await this.incidenciasService.obtenerIncidencias();

      this.totalIncidencias = incidencias.length;

      this.pendientes = incidencias.filter(
        incidencia =>
          incidencia.estado?.trim().toLowerCase() === 'pendiente'
      ).length;

      this.enProceso = incidencias.filter(
        incidencia =>
          incidencia.estado?.trim().toLowerCase() === 'en proceso'
        || incidencia.estado?.trim().toLowerCase() === 'en progreso'
      ).length;

    } catch (error) {
      console.error('Error al cargar las incidencias:', error);

      this.mensajeError =
        'No se pudieron cargar las incidencias. Comprueba tu conexión.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
