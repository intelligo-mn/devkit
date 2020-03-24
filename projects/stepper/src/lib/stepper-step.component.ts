import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "dev-stepper-step",
  template: `
    <div [hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `
})
export class DevStepperStepComponent {
  @Output() id: string;
  @Input() title: string;
  @Input() isValid = false;

  @Input() onHiddenEvent: EventEmitter<boolean>;

  private _isActive = false;
  private _hidden = false;
  isDisabled = false;

  constructor() {
    this.onHiddenEvent = new EventEmitter();
  }
  @Input("hidden")
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this.onHiddenEvent.emit(hidden);
    this._isActive = false;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  @Input("isActive")
  set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}