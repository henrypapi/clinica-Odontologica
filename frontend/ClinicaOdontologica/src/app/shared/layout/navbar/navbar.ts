import { Component, computed, inject } from '@angular/core'; // 1. Importamos 'computed' y 'inject'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/auth'; // 2. Importa tu AuthService
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  
  // 3. Inyectamos el servicio y el router
  public authService = inject(AuthService);
  private router = inject(Router);

  menuPublico: MenuItem[] = [
    { label: 'Inicio', path: '/home' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Servicios', path: '/services' },
    { label: 'Doctores', path: '/doctors' },
    { label: 'Contacto', path: '/contact' }
  ];

  menuAdmin: MenuItem[] = [
    { label: 'Dashboard', path: 'admin/dashboard' },
    { label: 'Pacientes', path: 'admin/pacientes' },
    { label: 'Usuarios', path: 'admin/usuarios' },
    { label: 'Mis Citas', path: 'admin/citas' },
    //{ label: 'Historial', path: 'admin/historial' },
    { label: 'Perfil', path: 'admin/perfil' }
  ];

    menuEmpleado: MenuItem[] = [
    { label: 'Dashboard', path: 'empleado/dashboard' },
    { label: 'Pacientes', path: 'empleado/pacientes' },
    { label: 'Citas', path: 'empleado/citas' },
    //{ label: 'Historial', path: 'empleado/historial' },
    { label: 'Perfil', path: 'empleado/perfil' }
  ];

  menuCliente: MenuItem[]=[
    { label: 'Reservar cita', path: 'cliente/reservar' },
    { label: 'Mis Citas', path: 'cliente/citas' },
    //{ label: 'Historial', path: 'cliente/historial' },
    { label: 'Perfil', path: 'cliente/perfil' }

  ];



  // 4. LA MAGIA: 'computed' detecta cambios en el usuario automáticamente.
  // Si authService.currentUser() tiene datos, devuelve menú privado. Si es null, menú público.
  currentMenu = computed(() => {

      const user = this.authService.currentUser();
      

      if (!user) {
      return this.menuPublico;
      }

      const rol= user.rol;
      
      switch (rol) {
      case 'admin':
        return this.menuAdmin;
      
      case 'empleado':
        return this.menuEmpleado;
      
      case 'cliente': 
        return this.menuCliente;
      
      default:
        
        return this.menuCliente; 
    }
  });

  // 5. Función de cerrar sesión simplificada
  cerrarSesion() {
    this.authService.logout(); // Usamos el método del servicio
    // El 'computed' de arriba detectará que el usuario es null y cambiará el menú solo.
  }
}