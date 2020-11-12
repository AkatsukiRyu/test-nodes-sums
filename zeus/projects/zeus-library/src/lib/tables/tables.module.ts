import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoseidonTableComponent } from './table/table.component';
import {
  PoTableHeaderDirective,
  PoTableRowDirective,
} from './table/table-directive';

@NgModule({
  declarations: [
    PoseidonTableComponent,
    PoTableHeaderDirective,
    PoTableRowDirective,
  ],
  imports: [CommonModule],
  exports: [
    PoseidonTableComponent,
    PoTableHeaderDirective,
    PoTableRowDirective,
  ],
})
export class PoseidonTableModule {}
