import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule as pCalendarModule } from 'primeng/calendar';
import { CalendarComponent, PDateTemplateDirective } from './calendar.component';

@NgModule({
  declarations: [CalendarComponent, PDateTemplateDirective],
  imports: [CommonModule, pCalendarModule],
  exports: [CalendarComponent, PDateTemplateDirective]
})
export class CalendarModule {}
