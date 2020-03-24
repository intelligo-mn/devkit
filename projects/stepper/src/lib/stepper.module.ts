import { NgModule } from "@angular/core";
import { DevStepperComponent } from "./stepper.component";
import { CommonModule } from "@angular/common";
import { DevStepperStepComponent } from "./stepper-step.component";

@NgModule({
  declarations: [DevStepperComponent, DevStepperStepComponent],
  imports: [CommonModule],
  exports: [DevStepperComponent, DevStepperStepComponent]
})
export class DevStepperModule {}
