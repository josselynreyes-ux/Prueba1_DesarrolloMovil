
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  IonItem,
  IonLabel,
  IonTextarea,
  IonImg
} from '@ionic/angular';

import {
  IncidenciasService,
  Incidencia
} from '../../services/incidencias.service';

@Component({
  selector: 'app-detalle-incidencia',
  templateUrl: './detalle-incidencia.page.html',
  styleUrls: ['./detalle-incidencia.page.scss'],
  
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonImg
  ]
})
export class DetalleIncidenciaPage {

  incidencia: Incidencia | null = null;

  observacion = '';
  mensaje = '';
  cargando = false;
  actualizando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.cargarDetalle();
  }

  async cargarDetalle() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.mensaje = 'No se recibió el código de la incidencia.';
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.cdr.detectChanges();

    try {
      this.incidencia =
        await this.incidenciasService.obtenerIncidenciaPorId(id);

      this.observacion = this.incidencia.observacion ?? '';

    } catch (error) {
      console.error('Error al cargar el detalle:', error);

      this.mensaje =
        'No se pudo cargar la incidencia. Comprueba tu conexión.';

    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async cambiarEstado(nuevoEstado: string) {
    if (!this.incidencia || !this.incidencia.id) {
      return;
    }

    const estadoActual =
      this.incidencia.estado.trim().toLowerCase();

    // Una incidencia resuelta no puede cambiar de estado
    if (estadoActual === 'resuelta' || estadoActual === 'resuelto') {
      this.mensaje =
        'Una incidencia resuelta no puede cambiar de estado.';
      return;
    }

    // Solo se permiten los cambios definidos en la prueba
    const cambiosPermitidos: Record<string, string[]> = {
      pendiente: ['en proceso', 'resuelta'],
      'en proceso': ['resuelta']
    };

    if (!cambiosPermitidos[estadoActual]?.includes(nuevoEstado)) {
      this.mensaje =
        'Ese cambio de estado no está permitido.';
      return;
    }

    // Resolver requiere una observación
    if (
      nuevoEstado === 'resuelta' &&
      !this.observacion.trim()
    ) {
      this.mensaje =
        'Escribe una observación antes de resolver la incidencia.';
      this.cdr.detectChanges();
      return;
    }

    this.actualizando = true;
    this.mensaje = '';
    this.cdr.detectChanges();

    const cambios: Partial<Incidencia> = {
      estado: nuevoEstado
    };

    if (nuevoEstado === 'resuelta') {
      cambios.observacion = this.observacion.trim();
    }

    try {
      this.incidencia =
        await this.incidenciasService.actualizarIncidencia(
          this.incidencia.id,
          cambios
        );

      this.observacion = this.incidencia.observacion ?? '';

      this.mensaje =
        'El estado de la incidencia se actualizó correctamente.';

    } catch (error) {
      console.error('Error al actualizar el estado:', error);

      this.mensaje =
        'No se pudo actualizar la incidencia. Comprueba tu conexión.';

    } finally {
      this.actualizando = false;
      this.cdr.detectChanges();
    }
  }

  volverAlListado() {
    this.router.navigate(['/incidencias']);
  }
}
