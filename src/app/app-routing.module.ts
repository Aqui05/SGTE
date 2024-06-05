import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ProfileComponent } from './pages/profil/profil.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { RouteComponent } from './pages/route/route.component';
import { VehicleEditComponent } from './pages/vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleComponent } from './pages/vehicle/vehicles-list/vehicle.component';
import { VehicleDetailsComponent } from './pages/vehicle/vehicle-details/vehicle-details.component';
import { VehicleAddComponent } from './pages/vehicle/vehicle-add/vehicle-add.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TransportListComponent } from './pages/transport/transport-list/transport-list.component';
import { TransportDetailsComponent } from './pages/transport/transport-details/transport-details.component';
import { TransportEditComponent } from './pages/transport/transport-edit/transport-edit.component';
import { TransportAddComponent } from './pages/transport/transport-add/transport-add.component';
import { MapComponent } from './components/map/map.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';


const routes: Routes = [
  //{ path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'accueil', component: AcceuilComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth/confirmation', component: ConfirmationComponent },
  { path: 'profil', component: ProfileComponent },


  { path: 'vehicles', component: VehicleComponent },
  { path: 'vehicle/:id', component: VehicleDetailsComponent },
  { path: 'vehicle/edit/:id', component: VehicleEditComponent },
  { path: 'new/vehicle', component: VehicleAddComponent },

  { path: 'transports', component: TransportListComponent },
  { path: 'transport/:id', component: TransportDetailsComponent },
  { path: 'transport/edit/:id', component: TransportEditComponent },
  { path: 'new/transport', component: TransportAddComponent },


  { path: 'reservation', component: ReservationComponent },
  { path: 'route', component: RouteComponent },


  { path: 'map', component: MapComponent },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'not-found', component: NotFoundComponent },

  { path: '**', redirectTo: '/not-found' },

  { path: 'internal-server-error', component: InternalServerErrorComponent },
  { path: 'unavailable', component: ServiceUnavailableComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
