import { Routes } from '@angular/router';
import { CountdownComponent } from './components/countdown/countdown.component';

export const COUNTDOWN_ROUTES: Routes = [
    {
        path: '',
        component: CountdownComponent
    }
];