import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CountDownDirective } from "projects/directives/src/public-api";

@NgModule({
  declarations: [CountDownDirective],
  imports: [CommonModule],
  exports: [CountDownDirective],
})
export class CountdownModule {}
