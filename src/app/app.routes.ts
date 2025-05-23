import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { SmsComponent } from './components/sms/sms.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { DashComponent } from './dash/dash.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'sms', component: SmsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'powerbi', component: DashComponent, canActivate: [AuthGuard], data: { roles: ['admin']} },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
