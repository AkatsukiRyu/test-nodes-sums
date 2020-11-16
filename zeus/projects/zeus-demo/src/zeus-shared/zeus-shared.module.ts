import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  declaredLayoutComponents,
  exportedLayoutComponents,
} from './layout/layout-exporter';

@NgModule({
  imports: [CommonModule],
  declarations: [...declaredLayoutComponents],
  exports: [...exportedLayoutComponents],
})
export class ZeusSharedModule {}
