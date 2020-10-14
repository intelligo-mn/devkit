import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[minWidth]',
})
export class SetWidthDirective {
  @Input('minWidth') width: string;
  constructor(private el: ElementRef) {}

  private highlight(width: string) {
    this.el.nativeElement.style.width = width;
  }
}
