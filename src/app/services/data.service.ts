
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private dataToken = 'dataToken';
  private baseUrl = 'http://localhost:8000';

  private popupWindow: Window | null = null;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  redirect(provider: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/${provider}`);
  }

  handle(provider: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/${provider}/callback`);
  }

  socialLogin(provider: string): Observable<any> {
    const url = `${this.baseUrl}/auth/${provider}`;
    const popupWidth = 600;
    const popupHeight = 600;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const systemZoom = window.outerWidth / window.innerWidth;
    const left = (window.screen.width - popupWidth) / 2 / systemZoom + dualScreenLeft;
    const top = (window.screen.height - popupHeight) / 2 / systemZoom + dualScreenTop;
    const popupOptions = `width=${popupWidth / systemZoom}, height=${popupHeight / systemZoom}, top=${top}, left=${left}`;

    return new Observable((observer: Observer<any>) => {
        this.popupWindow = window.open(url, '_blank', popupOptions);

        if (this.popupWindow) {
            const messageHandler = (event: MessageEvent) => {
                if (event.origin === window.location.origin) {
                    if (event.data.token) {

                        // Rediriger vers la page d'accueil
                        this.router.navigate(['/accueil']);

                        // Fermer la fenêtre popup
                        if (this.popupWindow) {
                            this.popupWindow.close();
                        }

                        observer.next(event.data);
                        observer.complete();

                        // Retirer l'écouteur d'événements
                        window.removeEventListener('message', messageHandler);
                    }
                }
            };

            window.addEventListener('message', messageHandler);

            const timer = setInterval(() => {
                if (this.popupWindow?.closed) {
                    clearInterval(timer);
                    observer.error('Popup fermée par l\'utilisateur');
                    window.removeEventListener('message', messageHandler); // Retirer l'écouteur d'événements en cas de fermeture
                }
            }, 500);
        } else {
            observer.error('Impossible d\'ouvrir la fenêtre popup');
        }
    });
}




  storeToken(token: string): void {
    this.cookieService.set('dataToken', token);
  }

  getToken(): string | null {
    return this.cookieService.get('dataToken');
  }

  clearToken(): void {
    this.cookieService.delete('dataToken');
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/user`, userData);
  }

  getUserInfo() {
    return this.http.get<any>(`${this.apiUrl}/user-details`);
  }


  /*
    * Vehicles services
  */

  getVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicles`);
  }

  getVehicle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicle/${id}`);
  }

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicle`, vehicle);
  }

  updateVehicle(id: number, vehicle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/vehicle/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicle/${id}`);
  }

  searchVehicle(info: string ,value: string) : Observable<any>  {
    return this.http.get(`${this.apiUrl}/vehicle/search/${info}/${value}`);
  }

  sortVehicle(value: string) : Observable<any>  {
    return this.http.get(`${this.apiUrl}/vehicle/sortBy/${value}`);
  }
  /*
    * Reservation services
  */
  getReservations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations`);
  }
  getReservation(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservation/${id}`);
  }
  addReservation(TransportId: number ,reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservation/${TransportId}`, reservation);
  }
  updateReservation(id: number, reservation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservation/${id}`, reservation);
  }
  deleteReservation(id: number, reservation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservation/${id}`, reservation);
  }

  ReservationTransport(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations/transport/${id}`);
  }

  ReservationVehicle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations/vehicle/${id}`);
  }

  getReservationsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations/list`);
  }

  /*
    * Transports services
  */

  getTransports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transports`);
  }
  getTransport(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/transport/${id}`);
  }
  addTransport(transport: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transport`, transport);
  }
  updateTransport(id: number, transport: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/transport/${id}`, transport);
  }
  deleteTransport(id: number, transport: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/transport/${id}`, transport);
  }

  createRoute(id: number, route: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transport/${id}/route`, route);
  }

  createPolyline(id: number, polyline: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/route/${id}/polyline`, polyline);
  }


  /*
    * Merchandise  Service
  */

  getMerchandises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/merchandises`);
  }

  getMerchandise(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/merchandise/${id}`);
  }

  addMerchandise(merchandise: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/merchandise`, merchandise);
  }

  updateMerchandise(id: number, merchandise: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/merchandise/${id}`, merchandise);
  }

  deleteMerchandise(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/merchandise/${id}`);
  }


  getMerchandisesExpeditions(expeditionId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/expeditions/merchandises/${expeditionId}`);
  }


  getMerchandisesList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/merchandises/list`);
  }

  getMerchandisesDeAr(depart: string, destination: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/merchandises/${depart}/${destination}`);
  }



  /*
    * Expeditions Services
  */

  getExpeditions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expeditions`);
  }

  getExpedition(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/expedition/${id}`);
  }

  addExpedition(expedition: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expedition`, expedition);
  }

  updateMerchandiseExpedition(expeditionId: number, merchandiseIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/expeditions/${expeditionId}/merchandises`, { merchandiseIds });
  }


  updateExpedition(id: number, expedition: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/expedition/${id}`, expedition);
  }

  deleteExpedition(id: number, expedition: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/expedition/${id}`, expedition);
  }

  getExpeditionsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expeditions/list`);
  }

  getExpeditionsDeAr(depart: string, destination: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/expeditions/${depart}/${destination}`);
  }


  //Users LIST

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }



  //Search service

  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, { params: { query } });
  }



  //User Dashboard Info

  getUserExpeditions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expeditions/user/list`);
  }

  getUserTransports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transports/user/list`);
  }
























  /*POLYLINE WAYPOINT ROUTES */

  getPolylines(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/route/${id}/polyline`);
  }

  getRoute(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/transport/${id}/route`);
  }

}
