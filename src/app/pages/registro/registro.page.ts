
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg
} from '@ionic/angular';

import {
  IncidenciasService,
  Incidencia
} from '../../services/incidencias.service';

import {
  ClimaService,
  DatosClima
} from '../../services/clima.service';

interface BorradorIncidencia {
  tipo: string;
  descripcion: string;
  direccion: string;
  sector: string;
  prioridad: string;
  latitud: number | null;
  longitud: number | null;
  latitudManual: number | null;
  longitudManual: number | null;
  fotografia: string;
  clima: DatosClima | null;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg
  ]
})
export class RegistroPage {

  private claveBorrador = 'urbaninspect_borrador';

  mostrarOpcionesBorrador = false;

  tipo = '';
  descripcion = '';
  direccion = '';
  sector = '';
  prioridad = 'media';

  latitud: number | null = null;
  longitud: number | null = null;

  latitudManual: number | null = null;
  longitudManual: number | null = null;

  fotografia = '';
  mensajeFoto = '';

  clima: DatosClima | null = null;
  mensajeClima = '';
  consultandoClima = false;

  mensaje = '';
  mensajeUbicacion = '';
  mensajeCoordenadas = '';

  guardando = false;
  obteniendoUbicacion = false;

  constructor(
    private incidenciasService: IncidenciasService,
    private climaService: ClimaService,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    try {
      const borrador = localStorage.getItem(this.claveBorrador);
      this.mostrarOpcionesBorrador = borrador !== null;
    } catch (error) {
      console.error('Error al buscar el borrador:', error);
      this.mostrarOpcionesBorrador = false;
    }

    this.cdr.detectChanges();
  }

  guardarBorradorAutomatico() {
    const tieneDatos =
      this.tipo !== '' ||
      this.descripcion.trim() !== '' ||
      this.direccion.trim() !== '' ||
      this.sector.trim() !== '' ||
      this.fotografia !== '' ||
      this.latitud !== null ||
      this.longitud !== null ||
      this.latitudManual !== null ||
      this.longitudManual !== null;

    if (!tieneDatos) {
      return;
    }

    const borrador: BorradorIncidencia = {
      tipo: this.tipo,
      descripcion: this.descripcion,
      direccion: this.direccion,
      sector: this.sector,
      prioridad: this.prioridad,
      latitud: this.latitud,
      longitud: this.longitud,
      latitudManual: this.latitudManual,
      longitudManual: this.longitudManual,
      fotografia: this.fotografia,
      clima: this.clima
    };

    try {
      localStorage.setItem(
        this.claveBorrador,
        JSON.stringify(borrador)
      );
    } catch (error) {
      console.error('No se pudo guardar el borrador:', error);
      this.mensaje =
        'No se pudo guardar el borrador localmente. Comprueba el espacio disponible.';
    }
  }

  continuarBorrador() {
    try {
      const contenido = localStorage.getItem(this.claveBorrador);

      if (!contenido) {
        this.mostrarOpcionesBorrador = false;
        return;
      }

      const borrador: BorradorIncidencia = JSON.parse(contenido);

      this.tipo = borrador.tipo ?? '';
      this.descripcion = borrador.descripcion ?? '';
      this.direccion = borrador.direccion ?? '';
      this.sector = borrador.sector ?? '';
      this.prioridad = borrador.prioridad ?? 'media';

      this.latitud = borrador.latitud ?? null;
      this.longitud = borrador.longitud ?? null;

      this.latitudManual = borrador.latitudManual ?? null;
      this.longitudManual = borrador.longitudManual ?? null;

      this.fotografia = borrador.fotografia ?? '';
      this.clima = borrador.clima ?? null;

      this.mensajeFoto = this.fotografia
        ? 'Fotografía recuperada del borrador.'
        : '';

      this.mensajeClima = this.clima
        ? 'Datos meteorológicos recuperados del borrador.'
        : '';

      this.mensaje = '';
      this.mensajeUbicacion = '';
      this.mensajeCoordenadas = '';
      this.mostrarOpcionesBorrador = false;

    } catch (error) {
      console.error('Error al recuperar el borrador:', error);
      this.mensaje =
        'No se pudo recuperar el borrador. Puedes descartarlo e iniciar uno nuevo.';
    }

    this.cdr.detectChanges();
  }

  descartarBorrador() {
    try {
      localStorage.removeItem(this.claveBorrador);
    } catch (error) {
      console.error('Error al eliminar el borrador:', error);
    }

    this.limpiarFormulario();
    this.mostrarOpcionesBorrador = false;
    this.mensaje =
      'Borrador descartado. Puedes registrar una nueva incidencia.';

    this.cdr.detectChanges();
  }

  private limpiarFormulario() {
    this.tipo = '';
    this.descripcion = '';
    this.direccion = '';
    this.sector = '';
    this.prioridad = 'media';

    this.latitud = null;
    this.longitud = null;
    this.latitudManual = null;
    this.longitudManual = null;

    this.fotografia = '';
    this.mensajeFoto = '';

    this.clima = null;
    this.mensajeClima = '';

    this.mensajeUbicacion = '';
    this.mensajeCoordenadas = '';
  }

  async obtenerUbicacion() {
    this.obteniendoUbicacion = true;
    this.mensajeUbicacion = 'Obteniendo ubicación...';
    this.cdr.detectChanges();

    try {
      const permiso = await Geolocation.checkPermissions();

      if (permiso.location !== 'granted') {
        const resultado = await Geolocation.requestPermissions();

        if (resultado.location !== 'granted') {
          this.mensajeUbicacion =
            'No se concedió el permiso de ubicación.';
          return;
        }
      }

      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      });

      this.latitud = posicion.coords.latitude;
      this.longitud = posicion.coords.longitude;

      this.latitudManual = null;
      this.longitudManual = null;

      this.mensajeUbicacion =
        'Ubicación obtenida correctamente.';

      this.mensajeCoordenadas = '';
      this.clima = null;
      this.mensajeClima = '';

      this.guardarBorradorAutomatico();

    } catch (error) {
      console.error('Error al obtener la ubicación:', error);

      this.mensajeUbicacion =
        'No se pudo obtener el GPS. Puedes introducir las coordenadas manualmente.';

    } finally {
      this.obteniendoUbicacion = false;
      this.cdr.detectChanges();
    }
  }

  usarCoordenadasManuales() {
    if (
      this.latitudManual === null ||
      this.longitudManual === null ||
      !Number.isFinite(this.latitudManual) ||
      !Number.isFinite(this.longitudManual) ||
      this.latitudManual < -90 ||
      this.latitudManual > 90 ||
      this.longitudManual < -180 ||
      this.longitudManual > 180
    ) {
      this.mensajeCoordenadas =
        'Introduce una latitud entre -90 y 90 y una longitud entre -180 y 180.';

      this.cdr.detectChanges();
      return;
    }

    this.latitud = this.latitudManual;
    this.longitud = this.longitudManual;

    this.mensajeCoordenadas =
      'Coordenadas manuales seleccionadas correctamente.';

    this.mensajeUbicacion = '';
    this.clima = null;
    this.mensajeClima = '';

    this.guardarBorradorAutomatico();
    this.cdr.detectChanges();
  }

  // abre la camara del celular
  async tomarFotografia() {
    try {
      const foto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        correctOrientation: true
      });

      if (!foto.dataUrl) {
        this.mensajeFoto =
          'No se pudo obtener la fotografía.';
        this.cdr.detectChanges();
        return;
      }

      this.procesarFotografia(foto.dataUrl);

    } catch (error) {
      console.error('Error al tomar la fotografía:', error);

      this.mensajeFoto =
        'No se tomó la fotografía o no se pudo acceder a la cámara.';

      this.cdr.detectChanges();
    }
  }

  // Conserva la selección de imágenes desde la galería.
  seleccionarFotografia(event: Event) {
    const elemento = event.target as HTMLInputElement;
    const archivo = elemento.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      this.mensajeFoto =
        'Selecciona un archivo de imagen válido.';
      elemento.value = '';
      this.cdr.detectChanges();
      return;
    }

    if (archivo.size > 10 * 1024 * 1024) {
      this.mensajeFoto =
        'La imagen supera los 10 MB. Selecciona una más pequeña.';
      elemento.value = '';
      this.cdr.detectChanges();
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      if (typeof lector.result === 'string') {
        this.procesarFotografia(lector.result);
      } else {
        this.mensajeFoto =
          'No se pudo leer la imagen seleccionada.';
        this.cdr.detectChanges();
      }
    };

    lector.onerror = () => {
      this.mensajeFoto =
        'No se pudo leer la imagen seleccionada.';
      this.cdr.detectChanges();
    };

    lector.readAsDataURL(archivo);
  }

  // comprimir las imagenes de la camara y de la galeria.
  private procesarFotografia(origen: string) {
    const imagen = new Image();

    imagen.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const limite = 800;

        const escala = Math.min(
          1,
          limite / Math.max(imagen.width, imagen.height)
        );

        canvas.width = Math.max(
          1,
          Math.round(imagen.width * escala)
        );

        canvas.height = Math.max(
          1,
          Math.round(imagen.height * escala)
        );

        const contexto = canvas.getContext('2d');

        if (!contexto) {
          this.mensajeFoto =
            'No se pudo procesar la imagen.';
          this.cdr.detectChanges();
          return;
        }

        contexto.drawImage(
          imagen,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const imagenComprimida = canvas.toDataURL(
          'image/jpeg',
          0.5
        );

        const tamañoAproximado =
          Math.ceil(imagenComprimida.length * 0.75);

        if (tamañoAproximado > 400 * 1024) {
          this.mensajeFoto =
            'La imagen sigue siendo demasiado grande. Selecciona otra fotografía.';
          this.cdr.detectChanges();
          return;
        }

        this.fotografia = imagenComprimida;
        this.mensajeFoto =
          'Fotografía comprimida y preparada correctamente.';

        this.guardarBorradorAutomatico();

      } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        this.mensajeFoto =
          'No se pudo comprimir la fotografía.';
      } finally {
        this.cdr.detectChanges();
      }
    };

    imagen.onerror = () => {
      this.mensajeFoto =
        'No se pudo abrir la imagen.';
      this.cdr.detectChanges();
    };

    imagen.src = origen;
  }

  async consultarClima() {
    if (this.latitud === null || this.longitud === null) {
      this.clima = null;
      this.mensajeClima =
        'No hay ubicación seleccionada. Introduce las coordenadas para consultar el clima. Puedes continuar con el registro si la ubicación no es obligatoria.';

      this.cdr.detectChanges();
      return;
    }

    this.consultandoClima = true;
    this.mensajeClima = '';
    this.clima = null;
    this.cdr.detectChanges();

    try {
      this.clima = await this.climaService.consultarClima(
        this.latitud,
        this.longitud
      );

      if (this.clima.precipitacion >5) {
        this.mensajeClima =
          'Advertencia: la precipitación supera los 5 mm. Las condiciones podrían dificultar el mantenimiento.';
      } else {
        this.mensajeClima =
          'Consulta meteorológica completada.';
      }

      this.guardarBorradorAutomatico();

    } catch (error) {
      console.error('Error al consultar el clima:', error);

      this.mensajeClima =
        'No se pudo consultar el clima. Puedes continuar con el registro.';

    } finally {
      this.consultandoClima = false;
      this.cdr.detectChanges();
    }
  }

  async guardarFormulario() {
    if (
      !this.tipo ||
      !this.descripcion.trim() ||
      !this.direccion.trim() ||
      !this.sector.trim() ||
      !this.prioridad
    ) {
      this.mensaje =
        'Completa todos los campos obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    if (
      this.tipo.toLowerCase() === 'bache' &&
      (this.latitud === null || this.longitud === null)
    ) {
      this.mensaje =
        'Para registrar un bache debes obtener o introducir su ubicación.';
      this.cdr.detectChanges();
      return;
    }

    if (this.prioridad === 'alta' && !this.fotografia) {
      this.mensaje =
        'Debes seleccionar una fotografía para registrar una incidencia de prioridad alta.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.mensaje = '';
    this.cdr.detectChanges();

    const nuevaIncidencia: Incidencia = {
      tipo: this.tipo,
      descripcion: this.descripcion.trim(),
      direccion: this.direccion.trim(),
      sector: this.sector.trim(),
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      prioridad: this.prioridad,
      fotografia: this.fotografia,
      latitud: this.latitud,
      longitud: this.longitud
    };

    try {
      await this.incidenciasService.guardarIncidencia(
        nuevaIncidencia
      );

      try {
        localStorage.removeItem(this.claveBorrador);
      } catch (error) {
        console.error('No se pudo eliminar el borrador:', error);
      }

      this.limpiarFormulario();
      this.mensaje =
        'Incidencia registrada correctamente.';

    } catch (error) {
      console.error('Error al guardar la incidencia:', error);

      this.mensaje =
        'No se pudo guardar la incidencia. Comprueba tu conexión o el tamaño de la imagen.';

    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }
}
