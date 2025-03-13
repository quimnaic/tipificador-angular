import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../../../models/user.model';
import { tap } from 'rxjs/operators';
import { enviroment } from '../../../properties/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkAuth());
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  urlLogin = enviroment.apiUrl +"gestion-cobranzas/public/api/login";
  urlRegister = enviroment.apiUrl + "gestion-cobranzas/public/api/register";

  private checkAuth(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  login(formData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.urlLogin, formData).pipe(
      tap((res: AuthResponse) => {
        console.log("Login exitoso, guardando token...");
        localStorage.setItem('token', res.token); // Guardar token en LocalStorage
        localStorage.setItem('document', res.user.document); // Guardar token en LocalStorage
        localStorage.setItem('isLoggedIn', 'true'); // Marcar sesión activa
        this.isAuthenticated.next(true); // Emitir estado de autenticación
      })
    );
  }

  logout() {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('isLoggedIn'); // Eliminar estado de autenticación
    localStorage.removeItem('document'); // Eliminar estado de autenticación
    this.isAuthenticated.next(false); // Emitir estado de autenticación como falso
  }

  register(formData: any): Observable<any>{
    return this.http.post<any>(this.urlRegister, formData);
  }
}