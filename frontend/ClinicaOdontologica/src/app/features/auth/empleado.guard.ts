import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const empleadoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userGuardado = localStorage.getItem('usuario_dental');

  if (userGuardado) {
    const usuario = JSON.parse(userGuardado);
    
    if (usuario.rol === 'ROLE_admin' || usuario.role === 'admin') {
      router.navigate(['/admin/dashboard']); 
      return false;
    }

    return true; 
  }

  router.navigate(['/login']);
  return false; 
};