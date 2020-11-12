import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxModule } from './checkbox/checkbox.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { InputModule } from './input/input.module';
import { RadioButtonModule } from './radio/radio-button.module';
import { InplaceControlModule } from './inplace-control/inplace-control.module';
import { PoseidonFormSectionModule } from './form-section/form-section.model';
import { CalendarModule } from './calendar/calendar.module';
@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    InputModule,
    RadioButtonModule,
    DropdownModule,
    InplaceControlModule,
    PoseidonFormSectionModule
  ],
  exports: [
    CheckboxModule,
    InputModule,
    RadioButtonModule,
    DropdownModule,
    InplaceControlModule,
    PoseidonFormSectionModule,
    CalendarModule
  ]
})
export class FormModule { }
