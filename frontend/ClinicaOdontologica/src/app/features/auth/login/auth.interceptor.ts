import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userGuardado = localStorage.getItem('usuario_dental');
  let token = '';

  if (userGuardado) {
    const usuario = JSON.parse(userGuardado);
    token = usuario.token || usuario.accessToken; 
  }

  let peticionClonada = req;
  if (token) {
    peticionClonada = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(peticionClonada).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        
        // 4. Pedimos un token nuevo silenciosamente
        return authService.refreshToken().pipe(
          switchMap((nuevaRespuesta: any) => {
            const usuarioActualizado = JSON.parse(userGuardado!);
            usuarioActualizado.token = nuevaRespuesta.accessToken; 
            localStorage.setItem('usuario_dental', JSON.stringify(usuarioActualizado));

            const peticionReintentada = req.clone({
              setHeaders: { Authorization: `Bearer ${nuevaRespuesta.accessToken}` }
            });

            return next(peticionReintentada);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      
      return throwError(() => error);
    })
  );
};