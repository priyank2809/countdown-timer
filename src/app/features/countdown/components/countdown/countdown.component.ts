import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineService } from '../../services/deadline.service';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnInit, OnDestroy {

  protected deadlineService = inject(DeadlineService);
  private visibilityHandler: () => void;

  constructor() {
    this.visibilityHandler = this.handleVisibilityChange.bind(this);
  }

  ngOnInit(): void {
    this.deadlineService.startCountdown();

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.deadlineService.recalculateCountdown();
    }
  }

  ngOnDestroy(): void {
    this.deadlineService.stopCountdown();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

}
