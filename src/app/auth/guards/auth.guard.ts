import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']); // Redirigir si no está autenticado
      return false;
    }
    return true;
  }
}