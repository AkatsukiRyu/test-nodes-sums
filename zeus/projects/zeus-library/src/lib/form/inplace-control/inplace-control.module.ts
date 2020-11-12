import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InplaceControlComponent, ReadOnlyElementDirective, ControlDirective } from './inplace-control.component';

@NgModule({
  declarations: [InplaceControlComponent, ReadOnlyElementDirective, ControlDirective],
  imports: [CommonModule],
  exports: [ReadOnlyElementDirective, ControlDirective, InplaceControlComponent]
})
export class InplaceControlModule {}
