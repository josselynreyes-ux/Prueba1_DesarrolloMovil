
import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'incidencias',
    loadComponent: () =>
      import('./pages/incidencias/incidencias.page')
        .then((m) => m.IncidenciasPage),
  },
  {
    path: 'incidencias/:id',
    loadComponent: () =>
      import('./pages/detalle-incidencia/detalle-incidencia.page')
        .then((m) => m.DetalleIncidenciaPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page')
        .then((m) => m.RegistroPage),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];
