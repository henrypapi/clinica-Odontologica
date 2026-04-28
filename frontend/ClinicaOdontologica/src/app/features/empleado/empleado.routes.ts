import { Routes } from '@angular/router';
import { Pacientes } from '../shared-pages/pacientes/pacientes';
import { Citas } from '../shared-pages/citas/citas';
import { Dashboard } from '../shared-pages/dashboard/dashboard';
import { Historial } from '../shared-pages/historial/historial';
import { Perfil } from '../shared-pages/perfil/perfil';

export const empleadoRoutes: Routes = [
  { path: 'pacientes', component: Pacientes },
  { path: 'citas', component: Citas},
  { path: 'dashboard', component: Dashboard},
  { path: 'historial', component: Historial},
  { path: 'perfil', component: Perfil}
];