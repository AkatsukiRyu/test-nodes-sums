import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from './radio-button.component';

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [CommonModule, FormsModule],
  exports: [RadioButtonComponent]
})
export class RadioButtonModule {}
