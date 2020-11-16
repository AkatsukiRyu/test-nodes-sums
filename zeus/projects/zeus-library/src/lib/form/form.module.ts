import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxModule } from './checkbox/checkbox.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { InputModule } from './input/input.module';
import { RadioButtonModule } from './radio/radio-button.module';
import { InplaceControlModule } from './inplace-control/inplace-control.module';
import { ZeusFormSectionModule } from './form-section/form-section.model';
import { CalendarModule } from './calendar/calendar.module';
@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    InputModule,
    RadioButtonModule,
    DropdownModule,
    InplaceControlModule,
    ZeusFormSectionModule,
  ],
  exports: [
    CheckboxModule,
    InputModule,
    RadioButtonModule,
    DropdownModule,
    InplaceControlModule,
    ZeusFormSectionModule,
    CalendarModule,
  ],
})
export class FormModule {}
