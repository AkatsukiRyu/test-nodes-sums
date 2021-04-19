import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsButtonComponent, DsInputComponent } from './components';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DsButtonComponent, DsInputComponent],
  imports: [
    CommonModule
  ],
  exports: [DsButtonComponent, DsInputComponent]
})
export class DSFormModule { }
