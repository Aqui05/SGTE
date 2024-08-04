import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';

@Injectable()
export class DataInterceptor implements HttpInterceptor {
  constructor(private dataService: DataService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.dataService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/unauthorized']);
        } else if (error.status === 403) {
          this.router.navigate(['/forbidden']);
        } else if (error.status === 404) {
          this.router.navigate(['/not-found']);
        } else if (error.status === 500) {
          this.router.navigate(['/internal-server-error']);
        } else if (error.status === 503) {
          this.router.navigate(['/unavailable']);
        }
        return throwError(error);
      })
    );
  }
}
