import { Directive, ElementRef, Attribute, OnInit, HostListener } from '@angular/core';

@Directive({ selector: '[scrollTo]' })
export class ScrollToDirective implements OnInit {
  constructor(@Attribute('scrollTo') public elmID: string, private el: ElementRef) {}

  ngOnInit() {}

  currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) {
      return self.pageYOffset;
    }
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    }
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  }

  elmYPosition(eID) {
    const elm = document.getElementById(eID);
    let y = elm.offsetTop;
    let node: any = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
      node = node.offsetParent;
      y += node.offsetTop;
    }
    return y;
  }

  @HostListener('click', ['$event'])
  smoothScroll() {
    if (!this.elmID) {
      return;
    }
    const startY = this.currentYPosition();
    const stopY = this.elmYPosition(this.elmID);
    const distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY);
      return;
    }
    let speed = Math.round(distance / 50);
    if (speed >= 20) {
      speed = 20;
    }
    const step = Math.round(distance / 25);
    let leapY = stopY > startY ? startY + step : startY - step;
    let timer = 0;
    if (stopY > startY) {
      for (let i = startY; i < stopY; i += step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY += step;
        if (leapY > stopY) {
          leapY = stopY;
        }
        timer++;
      }
      return;
    }
    for (let i = startY; i > stopY; i -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) {
        leapY = stopY;
      }
      timer++;
    }
    return false;
  }
}
