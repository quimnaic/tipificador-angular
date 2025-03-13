import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopnavComponent } from './components/topnav/topnav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, FooterComponent, SidenavComponent, TopnavComponent, CommonModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'call-center';
  isLoggedIn = false; // Estado de autenticación

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Cargar estado desde localStorage
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Suscribirse a cambios en la autenticación
    this.authService.isAuthenticated$.subscribe(status => {
      console.log("Estado de autenticación cambiado:", status);
      this.isLoggedIn = status;
    });
  }
}