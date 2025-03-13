import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  imports: [],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css'
})
export class TopnavComponent {
  
  constructor(private authService: AuthService, private router: Router){}

  onSignOut(): void{
    // Aquí iría la lógica de validación del usuario
    this.authService.logout(); // Cambia el estado a autenticado
    this.router.navigate(['/login']);
}
}
