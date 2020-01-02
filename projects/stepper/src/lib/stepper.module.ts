import { NgModule } from '@angular/core';
import { StepperComponent } from './stepper.component';
import { CommonModule } from '@angular/common';
import { StepperStepComponent } from './stepper-step.component';



@NgModule({
  declarations: [StepperComponent, StepperStepComponent],
  imports: [
    CommonModule
  ],
  exports: [StepperComponent, StepperStepComponent]
})
export class StepperModule { }
