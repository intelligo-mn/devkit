import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
  EventEmitter,
  Output
} from "@angular/core";
import { DevStepperStepComponent } from "./stepper-step.component";

@Component({
  selector: "dev-stepper",
  templateUrl: "./stepper.component.html",
  styleUrls: ["./stepper.component.scss"]
})
export class DevStepperComponent implements AfterContentInit {
  @ContentChildren(DevStepperStepComponent)
  wizardSteps: QueryList<DevStepperStepComponent>;

  private _steps: Array<DevStepperStepComponent> = [];
  private _isCompleted = false;

  @Output()
  onStepChanged: EventEmitter<DevStepperStepComponent> = new EventEmitter<
    DevStepperStepComponent
  >();

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngAfterContentInit() {
    this.iniSteps();
  }

  iniSteps() {
    this._steps = [];
    if (this.wizardSteps) {
      this.wizardSteps.forEach(step => {
        step.onHiddenEvent.subscribe(hidden => {
          if (step.isActive) {
            this.steps[0].isActive = true;
          }
        });
        this._steps.push(step);
      });
      this.steps[0].isActive = true;
      this.onStepChanged.emit(this.steps[0]);
    }
  }

  get steps(): Array<DevStepperStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get activeStep(): DevStepperStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: DevStepperStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  public get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get firstStep(): boolean {
    return this.activeStepIndex === 0;
  }

  get lastStep(): boolean {
    return this.activeStepIndex === this.steps.length - 1;
  }

  get hasNextStep(): boolean {
    return !this.lastStep && this.activeStepIndex < this.steps.length - 1;
  }

  get hasPrevStep(): boolean {
    return !this.firstStep && this.activeStepIndex > 0;
  }

  public goToStep(step: DevStepperStepComponent): void {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  public next(): void {
    if (this.hasNextStep) {
      const nextStep: DevStepperStepComponent = this.steps[
        this.activeStepIndex + 1
      ];
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
      this.onNext.emit();
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      const prevStep: DevStepperStepComponent = this.steps[
        this.activeStepIndex - 1
      ];
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
      this.onPrev.emit();
    }
  }

  public complete(): void {
    this._isCompleted = true;
    this.onComplete.emit();
  }
}
