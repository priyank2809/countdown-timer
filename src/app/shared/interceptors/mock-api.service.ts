import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DeadlineResponse } from '../models/deadline.model';

export const mockApiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    if (req.url === '/api/deadline') {
        console.log('Intercepted API request to /api/deadline');
        const mockResponse: DeadlineResponse = {
            secondsLeft: 300
        };

        return of(new HttpResponse({
            status: 200,
            body: mockResponse
        }));
    }

    return next(req);
};