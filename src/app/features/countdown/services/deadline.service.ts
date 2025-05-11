import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeadlineResponse } from '../../../shared/models/deadline.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeadlineService {
    private API_URL = '/api/deadline';
    private http = inject(HttpClient);
    private intervalId: number | null = null;

    private _secondsLeft = signal<number | null>(null);
    public secondsLeft = computed(() => this._secondsLeft());

    private initialSecondsLeft: number | null = null;
    private lastFetchTime: number = 0;

    // constructor() {
    //     this.fetchFromApi().pipe(takeUntilDestroyed()).subscribe();
    // }

    fetchFromApi() {
        return this.http.get<DeadlineResponse>(this.API_URL).pipe(
            catchError(error => {
                console.error('Error fetching deadline data:', error);
                return of({ secondsLeft: 0 } as DeadlineResponse);
            })
        );
    }

    startCountdown(): void {
        if (this.intervalId !== null) {
            return;
        }

        this.fetchFromApi().subscribe(response => {
            this.initialSecondsLeft = response.secondsLeft;
            this.lastFetchTime = Date.now();
            this._secondsLeft.set(response.secondsLeft);

            this.intervalId = window.setInterval(() => {
                const current = this._secondsLeft();
                if (current !== null && current > 0) {
                    this._secondsLeft.set(current - 1);
                } else if (current === 0) {
                    this.stopCountdown();
                }
            }, 1000);
        });
    }

    stopCountdown(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    refreshCountdown(): void {
        this.fetchFromApi().subscribe(response => {
            this._secondsLeft.set(response.secondsLeft);
        });
    }

    recalculateCountdown(): void {
        if (this.initialSecondsLeft === null) {
            return;
        }

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - this.lastFetchTime) / 1000);

        const newSecondsLeft = Math.max(0, this.initialSecondsLeft - elapsedSeconds);
        this._secondsLeft.set(newSecondsLeft);
    }
}