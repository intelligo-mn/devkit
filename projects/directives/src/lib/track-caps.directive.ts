import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[capsLock]',
})
export class TrackCapsDirective {
  constructor() {}

  @Output('capsLock') capsLock = new EventEmitter<boolean>();
  @Output('languageEmitter') languageEmitter = new EventEmitter<string>();

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const englishRegex = new RegExp('^[a-zA-Z]$');
    const mongolianRegex = new RegExp('^[а-яА-ЯөӨүҮёЁ]$');

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      if (englishRegex.test(event.key)) {
        this.languageEmitter.emit('ENG');
      } else if (mongolianRegex.test(event.key)) {
        this.languageEmitter.emit('MON');
      } else {
        this.languageEmitter.emit(null);
      }
    }

    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    this.capsLock.emit(capsOn);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    this.capsLock.emit(capsOn);
  }
}
