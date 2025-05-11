import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'countdown',
        pathMatch: 'full'
    },
    {
        path: 'countdown',
        loadChildren: () => import('./features/countdown/countdown.routes').then(m => m.COUNTDOWN_ROUTES)
    }
];
