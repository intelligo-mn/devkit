import { isPlatformBrowser } from "@angular/common";
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from "@angular/core";
import { CountDown, CountDownOptions } from "./count-down";

@Directive({
  selector: "[countDown]",
})
export class CountDownDirective implements OnChanges {
  countDown: CountDown;

  @Input("countDown") endVal: number;

  previousEndVal: number;

  @Input() options: CountDownOptions = {};
  @Input() reanimateOnClick = true;
  @Output() complete = new EventEmitter<void>();

  @HostListener("click")
  onClick() {
    if (this.reanimateOnClick) {
      this.animate();
    }
  }

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (changes.endVal && changes.endVal.currentValue !== undefined) {
      if (this.previousEndVal !== undefined) {
        this.options = {
          ...this.options,
          startVal: this.previousEndVal,
        };
      }
      this.countDown = new CountDown(
        this.el.nativeElement,
        this.endVal,
        this.options
      );
      this.animate();
      this.previousEndVal = this.endVal;
    }
  }

  private animate() {
    this.zone.runOutsideAngular(() => {
      this.countDown.reset();
      this.countDown.start(() => {
        this.zone.run(() => {
          this.complete.emit();
        });
      });
    });
  }
}
