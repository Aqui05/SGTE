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
                    this.router.navigate(['/home']);
                } else if (error.status === 403) {
                    this.router.navigate(['/forbidden']);
                } else if (error.status === 404) {
                    this.router.navigate(['/not-found']);
                }
                return throwError(error);
            })
        );
    }
}