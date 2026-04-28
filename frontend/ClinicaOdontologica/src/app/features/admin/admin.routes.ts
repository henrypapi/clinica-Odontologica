import { Routes } from '@angular/router';
import { GestionUsuarios } from './gestion-usuarios/gestion-usuarios'
import { Reportes } from './reportes/reportes'
import { Citas } from '../shared-pages/citas/citas';
import { Dashboard } from '../shared-pages/dashboard/dashboard';
import { Historial } from '../shared-pages/historial/historial';
import { Perfil } from '../shared-pages/perfil/perfil';
import { Pacientes } from '../shared-pages/pacientes/pacientes';

export const adminRoutes: Routes = [
  { path: 'usuarios', component: GestionUsuarios },
  { path: 'reportes', component: Reportes },
  { path: 'citas', component: Citas},
  { path: 'dashboard', component: Dashboard},
  { path: 'historial', component: Historial},
  { path: 'perfil', component: Perfil},
  { path: 'pacientes', component: Pacientes}
];