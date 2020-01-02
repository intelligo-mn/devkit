import { NgModule } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [MultiSelectComponent]
})
export class MultiSelectModule { }
