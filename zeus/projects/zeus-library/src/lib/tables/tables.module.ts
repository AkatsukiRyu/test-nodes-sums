import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZeusTableComponent } from './table/table.component';
import {
  PoTableHeaderDirective,
  PoTableRowDirective,
} from './table/table-directive';

@NgModule({
  declarations: [
    ZeusTableComponent,
    PoTableHeaderDirective,
    PoTableRowDirective,
  ],
  imports: [CommonModule],
  exports: [ZeusTableComponent, PoTableHeaderDirective, PoTableRowDirective],
})
export class ZeusTableModule {}
