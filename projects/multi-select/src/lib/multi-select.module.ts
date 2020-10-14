import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultiSelectComponent } from "./multi-select.component";

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [CommonModule, FormsModule],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {}
