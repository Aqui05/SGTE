import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ProfileComponent } from './pages/profil/profil.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MapComponent } from './components/map/map.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'auth/confirmation', component: ConfirmationComponent },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'internal-server-error', component: InternalServerErrorComponent },
      { path: 'unavailable', component: ServiceUnavailableComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'map/:id', component: MapComponent, data: { title: 'map' }  },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' }  },
      { path: 'profile', component: ProfileComponent, data: { title: 'Profil' }  },
      { path: 'transport', loadChildren: () => import('./admin/transport/transport.module').then(m => m.TransportModule) },
      { path: 'vehicle', loadChildren: () => import('./admin/vehicle/vehicle.module').then(m => m.VehicleModule) },
      { path: 'expedition', loadChildren: () => import('./admin/expedition/expedition.module').then(m => m.ExpeditionModule) },
      { path: 'merchandise', loadChildren: () => import('./admin/merchandise/merchandise.module').then(m => m.MerchandiseModule) },
      { path: 'map/:id', component: MapComponent, data: { title: 'map' }  },
    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AcceuilComponent, data: { title: 'Dashboard' } },
      { path: 'map', component: MapComponent, data: { title: 'map' }  },
      { path: 'profile', component: ProfileComponent, data: { title: 'Profil' }  },
      { path: 'reservation', loadChildren: () => import('./user/reservation/reservation.module').then(m => m.ReservationModule) },
      { path: 'transport', loadChildren: () => import('./user/transport/transport.module').then(m => m.TransportModule)},
      { path: 'expedition', loadChildren: () => import('./user/expedition/expedition.module').then(m => m.ExpeditionModule) },
      { path: 'merchandise', loadChildren: () => import('./user/merchandise/merchandise.module').then(m => m.MerchandiseModule) },
    ]
  },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
