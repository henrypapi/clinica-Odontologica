import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { Login } from './features/auth/login/login';
import { Home } from './features/public/home/home';
import { About } from './features/public/about/about';
import { Services } from './features/public/services/services';
import { Doctors } from './features/public/doctors/doctors';
import { Contact } from './features/public/contact/contact';

export const routes: Routes = [
  
  // =======================================================
  // 1. RUTAS FUERA DEL LAYOUT (No tienen Navbar ni Footer)
  // =======================================================
  { path: 'login', component: Login },

  // =======================================================
  // 2. RUTAS DENTRO DEL LAYOUT (Tienen Navbar inteligente)
  // =======================================================
  {
    path: '',
    component: MainLayout, 
    children: [
      
      // --- A. PÚBLICAS (Las que ya tenías) ---
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home }, 
      { path: 'about', component: About },
      { path: 'services', component: Services },
      { path: 'contact', component: Contact },

      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/shared-pages/dashboard/dashboard').then(m => m.Dashboard)
      },

      // --- C. ADMIN (Sus propias páginas exclusivas) ---
      {
        path: 'admin',
        // Carga un archivo de rutas aparte para no ensuciar este
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)

        //añadir los routes
      },

      // --- D. EMPLEADO (Sus propias páginas exclusivas) ---
      {
        path: 'empleado',
        loadChildren: () => import('./features/empleado/empleado.routes').then(m => m.empleadoRoutes)
      }
    ]
  },

  // =======================================================
  // 3. RUTA COMODÍN (Si escriben mal la URL)
  // =======================================================
  { path: '**', redirectTo: 'home' }
];