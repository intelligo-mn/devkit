export class MaskingBase {
  private oldLength: number;

  private oldValue: string;

  private caretPos: number;

  public _mask = '';

  public _slotChar = '_';

  public _showPlaceholder = false;

  public _input: any;

  public value: string;

  public focus: boolean;

  public _overwriteOnInsert = false;

  private clear: boolean;

  private static isNumeric(s: string) {
    if (s === ' ') {
      return false;
    }
    return !isNaN(Number(s));
  }

  private static isDate(s: string) {
    if (!MaskingBase.isNumeric(s)) {
      return false;
    }
    return true;
  }

  private static isMonth(s: string) {
    if (!MaskingBase.isNumeric(s)) {
      return false;
    }
    return true;
  }

  private static isAlpha(s: string) {
    return s.match(/^[a-z]+$/i) !== null;
  }

  public checkValue(onFocus = false) {
    this.oldValue = this.value;
    this.value = this._input.value;
    this.focus = onFocus;

    if (!this.focus && this.oldValue.length < this._input.value.length && !this.isInputKeyAcceptable()) {
      this.caretPos = this._input.selectionStart;
      this.value = this.oldValue;
      this._input.value = this.oldValue;
      this._input.selectionStart = this.caretPos - 1;
      this._input.selectionEnd = this.caretPos - 1;
      return;
    }
    if (this._overwriteOnInsert && this._input.selectionStart < this._input.value.length && !this.focus) {
      let selectionStart = this._input.selectionStart;

      if (!MaskingBase.isAlpha(this.value.charAt(selectionStart)) && !MaskingBase.isNumeric(this.value.charAt(selectionStart))) {
        selectionStart++;
      } else if (!MaskingBase.isMonth(this.value.charAt(selectionStart))) {
        selectionStart + 2;
      }
      this.value = this.value.slice(0, selectionStart) + this.value.slice(selectionStart + 1, 2);
    }
    if (!this.value && !this.focus) {
      return;
    }
    this.maskValue();
  }

  private isInputKeyAcceptable(): boolean {
    if (
      this._mask.charAt(this._input.selectionStart - 1) === '9' &&
      !MaskingBase.isNumeric(this._input.value.charAt(this._input.selectionStart - 1))
    ) {
      return false;
    }
    if (
      this._mask.charAt(this._input.selectionStart - 1) === 'A' &&
      !MaskingBase.isAlpha(this._input.value.charAt(this._input.selectionStart - 1))
    ) {
      return false;
    }
    if (this.getConstChars().includes(this._mask.charAt(this._input.selectionStart - 1))) {
      if (
        this._mask.charAt(this._input.selectionStart) === '9' &&
        !MaskingBase.isNumeric(this._input.value.charAt(this._input.selectionStart - 1))
      ) {
        return false;
      }
      if (
        this._mask.charAt(this._input.selectionStart) === 'A' &&
        !MaskingBase.isAlpha(this._input.value.charAt(this._input.selectionStart - 1))
      ) {
        return false;
      }
    }
    return true;
  }

  private getConstChars(): string[] {
    const constChars = this._mask.replace(/[9A]/g, '').split('');
    return constChars.filter((v, i, a) => a.indexOf(v) === i);
  }

  public maskValue() {
    let maskedValue = '';
    let dif = 0;
    let foundPlaceholder = false;
    this.value = this.removeMask(this.value);

    let monthFirst: number = null;
    let dayFirst: number = null;

    for (let i = 0; i < this._mask.length && this.value.length !== i; i++) {
      const maskChar = this._mask.charAt(i + dif);
      const valueChar = this.value.charAt(i);

      if (this._showPlaceholder && valueChar === this._slotChar) {
        if (foundPlaceholder) {
          break;
        }
        foundPlaceholder = true;
      }
      if (!MaskingBase.isAlpha(valueChar) && !MaskingBase.isNumeric(valueChar) && valueChar !== maskChar) {
        this.value = this.value.substring(0, i) + this.value.substring(i + 1);
        i--;
      } else if (maskChar === '9') {
        if (MaskingBase.isNumeric(valueChar)) {
          maskedValue += valueChar;
        } else {
          this.value = this.value.substring(0, i) + this.value.substring(i + 1);
          i--;
        }
      } else if (maskChar === 'Y') {
        if (MaskingBase.isNumeric(valueChar)) {
          maskedValue += valueChar;
        } else {
          this.value = this.value.substring(0, i) + this.value.substring(i + 1);
          i--;
        }
      } else if (maskChar === 'M') {
        if (MaskingBase.isMonth(valueChar)) {
          if (monthFirst == null) {
            if (Number(valueChar) <= 1) {
              maskedValue += valueChar;
              monthFirst = Number(valueChar);
            } else {
              this.value = this.value.substring(0, i) + this.value.substring(i + 1);
              i--;
            }
          } else {
            if ((Number(valueChar) <= 9 && monthFirst == 0) || (Number(valueChar) <= 2 && monthFirst == 1)) {
              maskedValue += valueChar;
            } else {
              this.value = this.value.substring(0, i) + this.value.substring(i + 1);
              i--;
            }
          }
        } else {
          this.value = this.value.substring(0, i) + this.value.substring(i + 1);
          i--;
        }
      } else if (maskChar === 'D') {
        if (MaskingBase.isDate(valueChar)) {
          if (dayFirst == null) {
            if (Number(valueChar) <= 3) {
              maskedValue += valueChar;
              dayFirst = Number(valueChar);
            } else {
              this.value = this.value.substring(0, i) + this.value.substring(i + 1);
              i--;
            }
          } else {
            if (
              (Number(valueChar) <= 9 && dayFirst == 0) ||
              (Number(valueChar) <= 9 && (dayFirst == 1 || dayFirst == 2)) ||
              (Number(valueChar) <= 1 && dayFirst == 3)
            ) {
              maskedValue += valueChar;
            } else {
              this.value = this.value.substring(0, i) + this.value.substring(i + 1);
              i--;
            }
          }
        } else {
          this.value = this.value.substring(0, i) + this.value.substring(i + 1);
          i--;
        }
      } else if (maskChar === 'A') {
        if (MaskingBase.isAlpha(this.value.charAt(i))) {
          maskedValue += valueChar;
        } else {
          this.value = this.value.substring(0, i) + this.value.substring(i + 1);
          i--;
        }
      } else if (maskChar !== valueChar && maskedValue.charAt(i + dif) !== maskChar) {
        maskedValue += maskChar;
        dif++;
        i--;
      } else {
        maskedValue += maskChar;
      }
    }
    this.oldLength = maskedValue.length;
    if (this._showPlaceholder) {
      maskedValue = this.fillWithPlaceholder(maskedValue);
      this.oldValue = this.fillWithPlaceholder(this.oldValue, true);
    }

    this.caretPos = this.getUpdatedCaretPos(maskedValue);
    this.value = maskedValue;
    this.updateInput();
  }

  public removeMask(value: string): string {
    let finalValue = value;
    const constChars = this.getConstChars();
    const regexpSlotChar = new RegExp(this._slotChar, 'g');
    finalValue = finalValue.replace(regexpSlotChar, '');
    for (let constCharsKey of constChars) {
      constCharsKey = '\\' + constCharsKey;
      const regExp = new RegExp(constCharsKey, 'g');
      finalValue = finalValue.replace(regExp, '');
    }

    return finalValue;
  }

  public updateInput() {
    this._input.value = this.value;
    if (this.focus && this.clear) {
      this.caretPos = 0;
      setTimeout(() => {
        this._input.selectionStart = this.caretPos;
        this._input.selectionEnd = this.caretPos;
      }, 0);
    } else {
      this._input.selectionStart = this.caretPos;
      this._input.selectionEnd = this.caretPos;
    }
  }

  private getUpdatedCaretPos(maskedValue: string) {
    let caretPos = this.getCaretPos();
    const startCaretPos = caretPos;
    if (caretPos === this._input.value.length || caretPos === this.oldLength) {
      caretPos = this.oldLength;
    } else {
      while (caretPos < this.value.length && this._mask.charAt(caretPos) !== '9' && this._mask.charAt(caretPos) !== 'A') {
        caretPos++;
      }
    }
    if (this._mask.charAt(caretPos - 1) !== '9' && this._mask.charAt(caretPos - 1) !== 'A' && caretPos === startCaretPos) {
      caretPos++;
    }
    return caretPos;
  }

  private fillWithPlaceholder(value: string, oldValue = false): string {
    if (value === undefined || value === null) {
      return value;
    }

    if (!oldValue && this.focus) {
      this.clear = !value || value.length === 0;
    }
    let mask = this._mask.replace(/[9A]/g, this._slotChar);
    mask = mask.substring(value.length, mask.length);
    value = value + mask;
    return value;
  }

  public blurEvent() {
    if (this.value.indexOf(this._slotChar) !== -1) {
      this.value = '';
      this.updateInput();
    }
  }

  public getCaretPos() {
    return this._input.selectionStart;
  }
}

import { Directive, ElementRef, HostListener, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[input-mask]',
})
export class InputMaskDirective extends MaskingBase {
  private update: boolean;

  constructor(public el: ElementRef) {
    super();
    this._input = el.nativeElement;
  }

  @Input() set input(input: ElementRef) {
    this._input = input.nativeElement;
  }

  @Input() set slotChar(value: string) {
    this._slotChar = value;
  }

  @Input() set showPlaceholder(value: boolean) {
    this._showPlaceholder = value;
  }

  @Input('input-mask') set mask(value: string) {
    this._mask = value;
  }

  @HostListener('input')
  onInput() {
    if (this.update) {
      this.update = false;
      return;
    }
    this.checkValue();
  }

  @HostListener('blur')
  onBlur() {
    this.blurEvent();
  }

  @HostListener('focus')
  onFocus() {
    this.checkValue(true);
  }

  updateInput(): void {
    super.updateInput();
    this.update = true;
    this._input.dispatchEvent(new Event('input'));
  }
}
