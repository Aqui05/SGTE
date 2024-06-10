import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';




import { NzMessageModule } from 'ng-zorro-antd/message';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { IconsProviderModule } from './icons-provider.module';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';



import { NzIconModule } from 'ng-zorro-antd/icon';
import { BellOutline, SettingOutline, UserOutline } from '@ant-design/icons-angular/icons';



import { DataInterceptor } from './data.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { ThreeSceneComponent } from './components/three-scene/three-scene.component';
import { ProfileComponent } from './pages/profil/profil.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { RouteComponent } from './pages/route/route.component';
import { PolylineComponent } from './pages/polyline/polyline.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MapComponent } from './components/map/map.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { IconsProviderModule } from './icons-provider.module';

registerLocaleData(en);

const icons = [ BellOutline, SettingOutline, UserOutline ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AcceuilComponent,
    RegisterComponent,
    HomeComponent,
    ConfirmationComponent,
    ThreeSceneComponent,
    ProfileComponent,
    EditProfileComponent,
    ReservationComponent,
    RouteComponent,
    PolylineComponent,
    ForbiddenComponent,
    NotFoundComponent,

    MapComponent,

    InternalServerErrorComponent,
    UnauthorizedComponent,
    ServiceUnavailableComponent,

    HomeLayoutComponent,
    AdminLayoutComponent,
    UserLayoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NzIconModule.forRoot(icons),
    NzMessageModule,
    GoogleMapsModule,

  ],
  providers: [
    CookieService,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DataInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
