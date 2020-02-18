import { Injectable } from '@angular/core';
@Injectable({ providedIn: "root" })
export class ChartTransition {
  private transitionDuration = 750;

  getTransitionDuration(): number {
    return this.transitionDuration;
  }
}
