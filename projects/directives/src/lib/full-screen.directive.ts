import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[fullScreenWindow]',
})
export class FullScreenWindowDirective {
  // Full screen
  private cancelFullScreen(el) {
    const requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
    if (requestMethod) {
      // cancel full screen.
      requestMethod.call(el);
    }

    // else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    //     var wscript = new ActiveXObject("WScript.Shell");
    //     if (wscript !== null) {
    //         wscript.SendKeys("{F11}");
    //     }
    // }
  }

  private requestFullScreen(el) {
    // Supports most browsers and their versions.
    const requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

    if (requestMethod) {
      // Native full screen.
      requestMethod.call(el);
    }
    // else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    //     var wscript = new ActiveXObject("WScript.Shell");
    //     if (wscript !== null) {
    //         wscript.SendKeys("{F11}");
    //     }
    // }
    return false;
  }

  @HostListener('click', ['$event'])
  toggleFullscreen() {
    const elem = document.body;
    const isInFullScreen =
      (document['fullScreenElement'] && document['fullScreenElement'] !== null) ||
      (document['mozFullScreen'] || document['webkitIsFullScreen']);

    if (isInFullScreen) {
      this.cancelFullScreen(document);
    } else {
      this.requestFullScreen(elem);
    }
    return false;
  }
}
