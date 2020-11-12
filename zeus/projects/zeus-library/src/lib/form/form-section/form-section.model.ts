import { NgModule } from '@angular/core';
import { FormSectionComponent, PoHeaderDirective } from './form-section.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FormSectionComponent, PoHeaderDirective],
  imports: [CommonModule],
  exports: [FormSectionComponent, PoHeaderDirective]
})
export class PoseidonFormSectionModule {}
